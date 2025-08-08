export interface IBotCommandExecutor<TContext = unknown> {
  execute(context: TContext): Promise<void>;
}
