import TelegramBot from 'node-telegram-bot-api';
import { IBotCommandExecutor } from '../interfaces/bot-command-executor.interface';

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
