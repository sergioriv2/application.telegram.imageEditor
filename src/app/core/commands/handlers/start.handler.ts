import { IBotCommandExecutor } from './bot-command-executor.interface';
import { ChatContextService } from '../../services/chat-context-service';
import { StartCommandContext } from '../contexts/start-command.context';
import { ChatContextStates } from '../../../constants/chat-context-states.constants';
import { IChatContext } from '../../schemas/chat-context.schema';

export class StartCommandHandler implements IBotCommandExecutor<StartCommandContext> {
  constructor(private chatContextService: ChatContextService) {}

  async execute(context: StartCommandContext): Promise<void> {
    const newChat: IChatContext = {
      telegramId: context.chatId,
      state: ChatContextStates.ChatInit,
    };

    await this.chatContextService.upsertOne(newChat);
    return;
    // await this.botInstance.sendMessage(context.chatId, StartMessage.Response);
  }
}
