import { ChatState } from '../../constants/chat-states.constants';
import { IChatDetail } from '../interfaces/chat-detail.interface';
import { ChatDetailRepository } from '../repositories/chat-detail-repository';

export class ChatDetailService {
  constructor(private chatDetailRepository: ChatDetailRepository) {}

  async getChatStateById(telegramId: number): Promise<ChatState> {
    const chatDetails = await this.chatDetailRepository.findById(telegramId);
    return chatDetails.state;
  }

  async findOne(telegramId: number) {
    return await this.chatDetailRepository.findById(telegramId);
  }

  async upsertOne(model: IChatDetail) {
    return await this.chatDetailRepository.findOneAndUpdate(model);
  }

  async create(model: IChatDetail) {
    return await this.chatDetailRepository.createOne(model);
  }
}
