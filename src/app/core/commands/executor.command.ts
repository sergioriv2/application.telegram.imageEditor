export class BotCommandExecutor<TArgs extends any[], TResult> {
  private readonly delegate: (...args: TArgs) => TResult;

  constructor(delegate: (...args: TArgs) => TResult) {
    this.delegate = delegate;
  }

  execute(...args: TArgs): TResult {
    return this.delegate(...args);
  }
}

export interface BaseBotCommand {
  execute(...args: any[]): void;
}
