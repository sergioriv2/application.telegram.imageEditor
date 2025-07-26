import { model } from 'mongoose';
import { chatContextSchema, IChatContext } from '../schemas/chat-context.schema';

const ChatContextModel = model<IChatContext>('ChatContext', chatContextSchema);
export default ChatContextModel;
