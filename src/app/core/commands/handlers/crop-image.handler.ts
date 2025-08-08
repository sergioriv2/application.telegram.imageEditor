import { ChatState } from '../../../constants/chat-states.constants';
import { IBotCommandExecutor } from '../../interfaces/bot-command-executor.interface';
import { ImageService } from '../../services/image-service';
import { CropImageContext } from '../../common/contexts/crop-image.context';
import { ChatDetailService } from '../../services/chat-detail-service';
import TelegramBot from 'node-telegram-bot-api';
import { IChatDetail } from '../../interfaces/chat-detail.interface';

export class CropImageHandler implements IBotCommandExecutor<CropImageContext> {
  constructor(
    private readonly chatDetailService: ChatDetailService,
    private readonly imageService: ImageService,
  ) {}

  async execute(context: CropImageContext): Promise<void> {
    const chatDetails = await this.chatDetailService.findOne(context.chatId);
    await this.handleCropImageProcess(chatDetails, context);
    return;
  }

  private async handleCropImageProcess(chatDetails: IChatDetail, commandArgs: CropImageContext) {
    const currentChatState = chatDetails.state;

    switch (currentChatState) {
      case ChatState.ChatInit:
      case ChatState.CroppedImageDelivered:
        await this.handleOnChatInit(chatDetails);
        break;
      case ChatState.BotWaitingForImage:
        await this.handleOnBotWaitingForImage(commandArgs.photo, chatDetails);
        await this.handleOnBotWaitingForDocument(commandArgs.document, chatDetails);
        break;
      default:
    }
  }

  private async handleOnBotWaitingForImage(photo: TelegramBot.ChatPhoto, chatDetails: IChatDetail) {
    return;
  }

  private async handleOnBotWaitingForDocument(photo: TelegramBot.Document, chatDetails: IChatDetail) {
    return;
  }

  // /*
  //   GIVEN: An user is starting the chat flow with the bot
  //   WHEN: The user talks to the bot
  //   AND: The state of the telegram chat is [ChatInit]
  //   THEN: The bot responds asking for the image to be cropped
  //   AND: The state of the telegram chat is updated to [BotWaitingForImage]
  // */
  private async handleOnChatInit(chatDetails: IChatDetail): Promise<void> {
    chatDetails.state = ChatState.BotWaitingForImage;
    await this.chatDetailService.upsertOne(chatDetails);
    // this.telegramBot.sendMessage(msg.chat.id, CropImageResponses.ChatInit);
  }
}
