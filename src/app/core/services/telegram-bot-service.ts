import TelegramBot from 'node-telegram-bot-api';
import { ConfigurationProperties } from '../../../config/config';
import { CropImageResponses, StartMessage } from '../../constants/response-constants';
import { ChatContextService } from './chat-context-service';
import { IChatContext } from '../schemas/chat-context.schema';
import { ChatContextStates } from '../../constants/chat-context-states.constants';
import { ImageService } from './image-service';

export class TelegramBotService {
  private telegramBot: TelegramBot;
  private chatContextRepository: ChatContextService;
  private imageService: ImageService;

  constructor(
    configuration: ConfigurationProperties,
    chatContextRepository: ChatContextService,
    imageService: ImageService,
  ) {
    this.chatContextRepository = chatContextRepository;
    this.imageService = imageService;
    this.telegramBot = new TelegramBot(configuration.properties.TelegramApiToken, {
      polling: true,
    });
  }

  async handleOnCropImage(msg: TelegramBot.Message): Promise<void> {
    const chatContext = await this.chatContextRepository.findOne(msg.chat.id);
    console.log({
      chatContext,
    });
    switch (chatContext.state) {
      case ChatContextStates.ChatInit:
      case ChatContextStates.CroppedImageDelivered:
        await this.handleOnChatInit(msg, chatContext);
        break;
      case ChatContextStates.BotWaitingForImage:
        await this.handleOnBotWaitingForImage(msg.photo, chatContext);
        await this.handleOnBotWaitingForDocument(msg.document, chatContext);
        break;
      default:
    }
  }

  async handleOnStart(chatId: number): Promise<void> {
    const newChat: IChatContext = {
      telegramId: chatId,
      state: ChatContextStates.ChatInit,
    };
    await this.chatContextRepository.upsertOne(newChat);
    this.telegramBot.sendMessage(chatId, StartMessage.Response);
  }

  init(): void {
    // Matches === /start
    this.telegramBot.onText(/\/start/, async (msg) => {
      await this.handleOnStart(msg.chat.id);
    });

    this.telegramBot.onText(/\/cropImage/, async (msg) => {
      await this.handleOnCropImage(msg);
    });

    // this.telegramBot.on('document', async (msg) => {
    //   await this.handleOnCropImage(msg);
    // });

    this.telegramBot.on('document', async (msg) => {
      await this.handleOnCropImage(msg);
    });

    this.telegramBot.on('image', async (msg) => {
      await this.handleOnCropImage(msg);
    });

    // Matches === /echo {message}
    // Returns === {message}
    this.telegramBot.onText(/\/echo (.+)/, (msg, match) => {
      const response = match[1];

      this.telegramBot.sendMessage(msg.chat.id, response);
    });
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
  private async handleOnBotWaitingForDocument(
    document: TelegramBot.Document,
    chatContext: IChatContext,
  ): Promise<void> {
    if (!document) return;

    // chatContext.state = ChatContextStates.UserWaitingForBotImage;
    // await this.chatContextRepository.upsertOne(chatContext);
    const hasValidMimeType = this.imageService.isValidMimeType(document.mime_type);

    // Capture the image that was sent
    if (!hasValidMimeType) {
      // TODO: Add logger for this exception
      this.telegramBot.sendMessage(chatContext.telegramId, CropImageResponses.ImageNotSentOnBotWaitingForImage);
      await this.handleOnStart(chatContext.telegramId);
      return;
    }

    if (document.thumb?.width < 512 || document.thumb?.height < 512) {
      // TODO: Add logger for this exception
      this.telegramBot.sendMessage(chatContext.telegramId, CropImageResponses.ImageNotSentOnBotWaitingForImage);
      await this.handleOnStart(chatContext.telegramId);
      return;
    }

    await this.handleOnBotProcessingImage(chatContext, document);
  }

  private async handleOnBotWaitingForImage(photo: TelegramBot.PhotoSize[], chatContext: IChatContext): Promise<void> {
    console.log({
      photo,
    });
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
      chatContext.state = ChatContextStates.BotWaitingForImage;
      await this.chatContextRepository.upsertOne(chatContext);
      return;
    }

    await this.handleOnBotProcessingImage(chatContext, null, highestResPhoto);
  }

  /*
    GIVEN: An user sent a valid photo to the bot
    WHEN: The bot continues the process of cropping the image
    AND: The size of the image is greater that 512 x 512
    AND: The state of the telegram chat is [BotWaitingForImage]
    THEN: The bot procceses the image as a file and crops it automatically for the user
    AND: The state of the telegram chat is updated to [UserWaitingForBotImage]
  */
  private async handleOnBotProcessingImage(
    chatContext: IChatContext,
    document?: TelegramBot.Document,
    photo?: TelegramBot.PhotoSize,
  ): Promise<void> {
    // chatContext.state = ChatContextStates.BotWaitingForImage;
    // await this.chatContextRepository.upsertOne(chatContext);

    const fileStream = this.telegramBot.getFileStream(document.file_id);
    const fileBuffer = await this.imageService.streamToBuffer(fileStream);
    let fileCropped: Buffer;

    if (document) {
      fileCropped = await this.imageService.cropImage(fileBuffer, document.thumb.width, document.thumb.height);
    }

    if (photo) {
      fileCropped = await this.imageService.cropImage(fileBuffer, photo.width, photo.height);
    }

    chatContext.state = ChatContextStates.CroppedImageDelivered;
    await this.chatContextRepository.upsertOne(chatContext);

    this.telegramBot.sendDocument(chatContext.telegramId, fileCropped);
    this.telegramBot.sendMessage(chatContext.telegramId, CropImageResponses.CroppedImageDelivered);
  }

  /*
    GIVEN: An user is starting the chat flow with the bot
    WHEN: The user talks to the bot
    AND: The state of the telegram chat is [ChatInit]
    THEN: The bot responds asking for the image to be cropped
    AND: The state of the telegram chat is updated to [BotWaitingForImage]
  */
  private async handleOnChatInit(msg: TelegramBot.Message, chatContext: IChatContext): Promise<void> {
    chatContext.state = ChatContextStates.BotWaitingForImage;
    await this.chatContextRepository.upsertOne(chatContext);
    this.telegramBot.sendMessage(msg.chat.id, CropImageResponses.ChatInit);
  }
}
