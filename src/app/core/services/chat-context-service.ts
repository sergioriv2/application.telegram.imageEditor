import { ChatContextRepository } from '../repositories/chat-context-repository';
import { IChatContext } from '../schemas/chat-context.schema';

export class ChatContextService {
  constructor(private chatContextRepository: ChatContextRepository) {}

  async findOne(telegramId: number) {
    return await this.chatContextRepository.findById(telegramId);
  }

  async upsertOne(model: IChatContext) {
    return await this.chatContextRepository.findOneAndUpdate(model);
  }

  async create(model: IChatContext) {
    return await this.chatContextRepository.createOne(model);
  }
}
