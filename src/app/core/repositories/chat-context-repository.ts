import ChatContextModel from '../models/chat-context.model';
import { IChatContext } from '../schemas/chat-context.schema';

export class ChatContextRepository {
  async findById(id: number): Promise<IChatContext> {
    return await ChatContextModel.findOne({
      telegramId: id,
    });
  }

  async findOneAndUpdate(model: IChatContext): Promise<IChatContext> {
    return await ChatContextModel.findOneAndUpdate(
      {
        telegramId: model.telegramId,
      },
      {
        ...model,
      },
      {
        upsert: true,
      },
    );
  }

  async createOne(model: IChatContext) {
    const newModel = new ChatContextModel(model);
    await newModel.save();
    return model;
  }
}
