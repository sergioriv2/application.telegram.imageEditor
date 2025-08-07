import TelegramBot from 'node-telegram-bot-api';
import { BotCommand, BotCommandsDescription } from '../../constants/bot-commands.constants';
import { StartCommandHandler } from '../commands/handlers/start.handler';
import { ChatContextService } from '../services/chat-context-service';
import { ImageService } from '../services/image-service';
import { IBotCommandExecutor } from '../commands/handlers/bot-command-executor.interface';
import { CropImageResponses, StartMessage } from '../../constants/response-constants';

export class BotCommandsModel {
  readonly groups: Map<string, BotCommandGroup>;

  constructor(
    private chatContextService: ChatContextService,
    private imageService: ImageService,
  ) {
    this.groups = new Map<string, BotCommandGroup>();
    this.registerCommands();
  }

  private registerCommands() {
    this.groups.set(
      BotCommand.Start,
      new BotCommandGroup(
        BotCommand.Start,
        BotCommandsDescription.Start,
        new StartCommandHandler(this.chatContextService),
        (msg) => ({
          chatId: msg.chat.id,
        }),
        StartMessage.Response,
      ),
    );

    this.groups.set(
      BotCommand.CropImage,
      new BotCommandGroup(
        BotCommand.CropImage,
        BotCommandsDescription.CropImage,
        new StartCommandHandler(this.chatContextService),
        (msg) => ({
          chatId: msg.chat.id,
        }),
        CropImageResponses.ChatInit,
      ),
    );
  }
}

export class BotCommandGroup<TContext = unknown> {
  readonly command: string;
  readonly description: string;
  readonly responseMessage?: string;
  private readonly executor: IBotCommandExecutor<TContext>;
  private readonly contextFactory: (msg: TelegramBot.Message) => TContext;

  constructor(
    command: string,
    description: string,
    executor: IBotCommandExecutor<TContext>,
    contextFactory: (msg: TelegramBot.Message) => TContext,
    responseMessage?: string,
  ) {
    this.command = command;
    this.description = description;
    this.executor = executor;
    this.contextFactory = contextFactory;
    this.responseMessage = responseMessage;
  }

  async run(msg: TelegramBot.Message) {
    const context = this.contextFactory(msg);
    await this.executor.execute(context);
  }
}
