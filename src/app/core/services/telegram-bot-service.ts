import TelegramBot from 'node-telegram-bot-api';
import { ConfigurationProperties } from '../../../config/config';
import { ChatDetailService } from './chat-detail-service';
import { ImageService } from './image-service';
import { BotCommandModel } from '../models/bot-command.model';
import { BotCommandGroup } from '../models/bot-command-group.model';
import { InteractionManager } from '../managers/interactions.manager';

export class TelegramBotService {
  private readonly telegramBot: TelegramBot;
  private readonly botCommands: BotCommandModel;
  private readonly dispatcher: InteractionManager;

  constructor(
    private readonly configuration: ConfigurationProperties,
    private readonly chatDetailService: ChatDetailService,
    private readonly imageService: ImageService,
  ) {
    this.botCommands = new BotCommandModel(this.chatDetailService, this.imageService);
    this.telegramBot = new TelegramBot(this.configuration.properties.TelegramApiToken, {
      polling: true,
    });
    this.dispatcher = new InteractionManager(this.chatDetailService, this.imageService, this.telegramBot);
    this.initializeCommands();
  }

  private initializeCommands(): void {
    this.telegramBot.setMyCommands([...this.botCommands.groups.values()]);
  }

  private registerCommandHandlers(group: BotCommandGroup): void {
    const regex = new RegExp(`\\/${group.command}`);
    this.telegramBot.onText(regex, async (msg) => {
      await group.run(msg);
      if (group.responseMessage) {
        this.telegramBot.sendMessage(msg.chat.id, group.responseMessage);
      }
    });
  }

  init(): void {
    // Listener for the registered commands:
    // 1. /start
    // 2. /cropimage
    for (const group of this.botCommands.groups.values()) {
      this.registerCommandHandlers(group);
    }

    this.telegramBot.on('photo', async (msg: TelegramBot.Message) => {
      await this.dispatcher.handleChatImage(msg);
    });

    // this.telegramBot.on('document', async (msg: TelegramBot.Message) => {
    //   await this.dispatcher.handleChatDocument(msg);
    // });
  }
}
