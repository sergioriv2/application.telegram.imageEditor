import TelegramBot from 'node-telegram-bot-api';
import { ChatDetailService } from '../services/chat-detail-service';
import { ImageService } from '../services/image-service';
import { ChatState } from '../../constants/chat-states.constants';
import { IChatDetail } from '../interfaces/chat-detail.interface';
import { CropImageResponses } from '../../constants/response-constants';

export class InteractionManager {
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
    console.log({ message });
    const chatDetails = await this.chatDetailService.findOne(message.chat.id);
    await this.handleSharedEvents(message, chatDetails, this.processImage);
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
      this.botInstace.sendMessage(chatDetails.telegramId, CropImageResponses.ImageNotSentOnBotWaitingForImage);
      return;
    }

    if (document.thumb?.width < 512 || document.thumb?.height < 512) {
      // TODO: Add logger for this exception
      this.botInstace.sendMessage(chatDetails.telegramId, CropImageResponses.ImageNotSentOnBotWaitingForImage);
      return;
    }

    await this.processSanitizedImage(chatDetails, document);
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

    if (highestResPhoto.width < 512 || highestResPhoto.height < 512) {
      // TODO: Add logger for this exception
      chatDetails.state = ChatState.BotWaitingForImage;
      await this.chatDetailService.upsertOne(chatDetails);
      return;
    }

    await this.processSanitizedImage(chatDetails, null, highestResPhoto);
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
    chatContext: IChatDetail,
    document?: TelegramBot.Document,
    photo?: TelegramBot.PhotoSize,
  ): Promise<void> {
    const fileStream = this.botInstace.getFileStream(document.file_id);
    const fileBuffer = await this.imageService.streamToBuffer(fileStream);
    let fileCropped: Buffer;

    if (document) {
      fileCropped = await this.imageService.cropImage(fileBuffer, document.thumb.width, document.thumb.height);
    }

    if (photo) {
      fileCropped = await this.imageService.cropImage(fileBuffer, photo.width, photo.height);
    }

    chatContext.state = ChatState.CroppedImageDelivered;
    await this.chatDetailService.upsertOne(chatContext);

    this.botInstace.sendDocument(chatContext.telegramId, fileCropped);
    this.botInstace.sendMessage(chatContext.telegramId, CropImageResponses.CroppedImageDelivered);
  }
}
