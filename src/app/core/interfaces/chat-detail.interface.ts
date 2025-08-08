import { ChatState } from '../../constants/chat-states.constants';

export interface IChatDetail {
  telegramId: number;
  state: ChatState;
}
