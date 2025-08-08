import { IBotCommandExecutor } from '../../interfaces/bot-command-executor.interface';
import { ChatDetailService } from '../../services/chat-detail-service';
import { StartCommandContext } from '../../common/contexts/start-command.context';
import { ChatState } from '../../../constants/chat-states.constants';
import { IChatDetail } from '../../interfaces/chat-detail.interface';

export class StartCommandHandler implements IBotCommandExecutor<StartCommandContext> {
  constructor(private readonly chatDetailService: ChatDetailService) {}

  async execute(context: StartCommandContext): Promise<void> {
    const newChat: IChatDetail = {
      telegramId: context.chatId,
      state: ChatState.ChatInit,
    };

    await this.chatDetailService.upsertOne(newChat);
    return;
  }
}
