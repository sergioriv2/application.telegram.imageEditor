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

    switch (chatContext.state) {
      case ChatContextStates.ChatInit:
      case ChatContextStates.CroppedImageDelivered:
        await this.handleOnChatInit(msg, chatContext);
        break;
      case ChatContextStates.BotWaitingForImage:
        await this.handleOnBotWaitingForImage(msg, chatContext);
        break;
      default:
    }
  }

  async handleOnStart(msg: TelegramBot.Message): Promise<void> {
    const newChat: IChatContext = {
      telegramId: msg.chat.id,
      state: ChatContextStates.ChatInit,
    };
    await this.chatContextRepository.create(newChat);
  }

  init(): void {
    console.log('E');
    // Matches === /start
    this.telegramBot.onText(/\/start/, async (msg) => {
      await this.handleOnStart(msg);
      this.telegramBot.sendMessage(msg.chat.id, StartMessage.Response);
    });

    this.telegramBot.onText(/\/cropImage/, async (msg) => {
      await this.handleOnCropImage(msg);
    });

    // this.telegramBot.on('document', async (msg) => {
    //   await this.handleOnCropImage(msg);
    // });

    this.telegramBot.on('photo', async (msg) => {
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
  private async handleOnBotWaitingForImage(msg: TelegramBot.Message, chatContext: IChatContext): Promise<void> {
    chatContext.state = ChatContextStates.UserWaitingForBotImage;
    await this.chatContextRepository.upsertOne(chatContext);
    const photoArray = msg.photo;

    // Capture the image that was sent
    if (!photoArray || photoArray.length <= 0) {
      // TODO: Add logger for this exception
      chatContext.state = ChatContextStates.BotWaitingForImage;
      await this.chatContextRepository.upsertOne(chatContext);
      return;
    }

    const highestResPhoto = photoArray[photoArray.length - 1];

    if (highestResPhoto.width > 512 && highestResPhoto.height > 512) {
      // TODO: Add logger for this exception
      chatContext.state = ChatContextStates.BotWaitingForImage;
      await this.chatContextRepository.upsertOne(chatContext);
      return;
    }

    await this.handleOnBotProcessingImage(msg, chatContext, highestResPhoto);
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
    msg: TelegramBot.Message,
    chatContext: IChatContext,
    highestResPhoto: TelegramBot.PhotoSize,
  ): Promise<void> {
    chatContext.state = ChatContextStates.BotProcessingImage;
    await this.chatContextRepository.upsertOne(chatContext);

    const fileStream = this.telegramBot.getFileStream(highestResPhoto.file_id);
    const fileBuffer = await this.imageService.streamToBuffer(fileStream);
    const fileCropped = await this.imageService.cropImage(fileBuffer, highestResPhoto.width, highestResPhoto.height);

    chatContext.state = ChatContextStates.CroppedImageDelivered;
    await this.chatContextRepository.upsertOne(chatContext);

    this.telegramBot.sendDocument(msg.chat.id, fileCropped);
    this.telegramBot.sendMessage(msg.chat.id, CropImageResponses.CroppedImageDelivered);
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
