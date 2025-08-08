import { Schema } from 'mongoose';
import { IChatDetail } from '../interfaces/chat-detail.interface';

export const chatDetailSchema = new Schema<IChatDetail>(
  {
    telegramId: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
