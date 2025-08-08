import { ChatState } from '../../../constants/chat-states.constants';
import { IBotCommandExecutor } from '../../interfaces/bot-command-executor.interface';
import { ResizeImageContext } from '../../common/contexts/resize-image.context';
import { ChatDetailService } from '../../services/chat-detail-service';

export class ConfirmResizeImageHandler implements IBotCommandExecutor<ResizeImageContext> {
  constructor(private readonly chatDetailService: ChatDetailService) {}

  async execute(context: ResizeImageContext): Promise<void> {
    const chatDetails = await this.chatDetailService.findOne(context.chatId);
    if (chatDetails.state !== ChatState.ImageNotSquareWaitingConfirmation) return;
    chatDetails.state = ChatState.ImageNotSquareWaitingConfirmed;
    await this.chatDetailService.upsertOne(chatDetails);
    return;
  }
}
