import TelegramBot from 'node-telegram-bot-api';
import { ChatDetailService } from '../services/chat-detail-service';
import { ImageService } from '../services/image-service';
import { ChatState } from '../../constants/chat-states.constants';
import { IChatDetail } from '../interfaces/chat-detail.interface';
import { ChatResponses } from '../../constants/response-constants';
import sharp from 'sharp';

export class InteractionManager {
  private readonly stickerWidth: number = 512;
  private readonly stickerHeight: number = 512;

  constructor(
    private readonly chatDetailService: ChatDetailService,
    private readonly imageService: ImageService,
    private readonly botInstace: TelegramBot,
  ) {}

  private async handleSharedEvents(
    message: TelegramBot.Message,
    chatDetails: IChatDetail,
    method: (message: TelegramBot.Message, chatDetails: IChatDetail) => Promise<void>,
  ) {
    switch (chatDetails.state) {
      case ChatState.BotWaitingForImage:
        await method(message, chatDetails);
        break;
      default:
        break;
    }
  }

  async handleChatImage(message: TelegramBot.Message): Promise<void> {
    const chatDetails = await this.chatDetailService.findOne(message.chat.id);
    // await this.handleSharedEvents(message, chatDetails, this.processImage);
    switch (chatDetails.state) {
      case ChatState.BotWaitingForImage:
        await this.processImage(message, chatDetails);
        break;
      default:
        this.botInstace.sendMessage(chatDetails.telegramId, 'No entendi. Chau');
        break;
    }
  }

  async handleChatDocument(message: TelegramBot.Message): Promise<void> {
    const chatDetails = await this.chatDetailService.findOne(message.chat.id);
    await this.handleSharedEvents(message, chatDetails, this.processDocument);
  }

  // Private methods
  /*
    GIVEN: An user is continuing the chat with the bot
    WHEN: The user sends an image to the bot
    AND: The size of the image is greater that 512 x 512
    AND: The state of the telegram chat is [BotWaitingForImage]
    THEN: The bot procceses the image as a file and crops it automatically for the user
    AND: The state of the telegram chat is updated to [UserWaitingForBotImage]

    GIVEN: An user is continuing the chat with the bot
    WHEN: The user sends an image to the bot
    AND: The size of the image is lower or equal that 512 x 512
    AND: The state of the telegram chat is [BotWaitingForImage]
    THEN: The state of the telegram chat is kept to [BotWaitingForImage]
  */
  private async processDocument(message: TelegramBot.Message, chatDetails: IChatDetail): Promise<void> {
    const document = message.document;
    if (!document) return;

    // chatContext.state = ChatContextStates.UserWaitingForBotImage;
    // await this.chatContextRepository.upsertOne(chatContext);
    const hasValidMimeType = this.imageService.isValidMimeType(document.mime_type);

    // Capture the image that was sent
    if (!hasValidMimeType) {
      // TODO: Add logger for this exception
      this.botInstace.sendMessage(chatDetails.telegramId, ChatResponses.ImageNotSentOnBotWaitingForImage);
      return;
    }

    if (document.thumb?.width < this.stickerWidth || document.thumb?.height < this.stickerHeight) {
      // TODO: Add logger for this exception
      this.botInstace.sendMessage(chatDetails.telegramId, ChatResponses.ImageNotSentOnBotWaitingForImage);
      return;
    }

    // await this.processSanitizedImage(chatDetails, document);
  }

  private async processImage(message: TelegramBot.Message, chatDetails: IChatDetail): Promise<void> {
    const photo = message.photo;
    if (!photo) return;

    // Capture the image that was sent
    // if (!photo || photo.length <= 0) {
    //   // TODO: Add logger for this exception
    //   chatContext.state = ChatContextStates.BotWaitingForImage;
    //   await this.chatContextRepository.upsertOne(chatContext);
    //   return;
    // }

    const highestResPhoto = photo[photo.length - 1];
    const doesImageNeedsEnlargement =
      highestResPhoto.width < this.stickerWidth || highestResPhoto.height < this.stickerHeight;

    // if (highestResPhoto.width < this.stickerWidth || highestResPhoto.height < this.stickerHeight) {
    //   // TODO: Add logger for this exception
    //   chatDetails.state = ChatState.BotWaitingForImage;
    //   await this.chatDetailService.upsertOne(chatDetails);
    //   return;
    // }

    // if (highestResPhoto.width !== highestResPhoto.height) {
    //   Logger.log(`${LogMessages.INTERACTIONS_MANAGER_IMAGE_NOT_SQUARE} UserTelegramId=${chatDetails.telegramId}`);
    //   chatDetails.state = ChatState.ImageNotSquareWaitingConfirmation;
    //   this.botInstace.sendMessage(chatDetails.telegramId, ChatResponses.ImageNotSquareWaitingForConfirmation, {
    //     parse_mode: 'Markdown',
    //   });
    //   await this.chatDetailService.upsertOne(chatDetails);
    //   return;
    // }

    await this.processSanitizedImage(chatDetails, highestResPhoto, doesImageNeedsEnlargement);
  }

  // /*
  //   GIVEN: An user sent a valid photo to the bot
  //   WHEN: The bot continues the process of cropping the image
  //   AND: The size of the image is greater that 512 x 512
  //   AND: The state of the telegram chat is [BotWaitingForImage]
  //   THEN: The bot procceses the image as a file and crops it automatically for the user
  //   AND: The state of the telegram chat is updated to [UserWaitingForBotImage]
  // */
  private async processSanitizedImage(
    chatDetail: IChatDetail,
    highestResPhoto: TelegramBot.PhotoSize,
    doesImageNeedsEnlargement: boolean,
  ): Promise<void> {
    const resizeFitKey: keyof sharp.FitEnum = doesImageNeedsEnlargement ? 'fill' : 'contain';
    const fileStream = this.botInstace.getFileStream(highestResPhoto.file_id);
    const fileBuffer = await this.imageService.streamToBuffer(fileStream);
    const fileCropped = await this.imageService.resizeImage(
      fileBuffer,
      this.stickerWidth,
      this.stickerHeight,
      resizeFitKey,
    );

    chatDetail.state = ChatState.CroppedImageDelivered;
    await this.chatDetailService.upsertOne(chatDetail);

    this.botInstace.sendDocument(chatDetail.telegramId, fileCropped, {
      caption: ChatResponses.CroppedImageDelivered,
    });
  }
}
