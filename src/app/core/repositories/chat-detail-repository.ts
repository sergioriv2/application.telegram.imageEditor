import { IChatDetail } from '../interfaces/chat-detail.interface';
import ChatDetailModel from '../models/chat-detail.model';

export class ChatDetailRepository {
  async findById(id: number): Promise<IChatDetail> {
    return await ChatDetailModel.findOne({
      telegramId: id,
    });
  }

  async findOneAndUpdate(model: IChatDetail): Promise<IChatDetail> {
    return await ChatDetailModel.findOneAndUpdate(
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

  async createOne(model: IChatDetail) {
    const newModel = new ChatDetailModel(model);
    await newModel.save();
    return model;
  }
}
