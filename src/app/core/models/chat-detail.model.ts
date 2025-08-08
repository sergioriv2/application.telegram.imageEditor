import { model } from 'mongoose';
import { chatDetailSchema } from '../schemas/chat-detail.schema';
import { IChatDetail } from '../interfaces/chat-detail.interface';

const ChatDetailModel = model<IChatDetail>('ChatDetail', chatDetailSchema);
export default ChatDetailModel;
