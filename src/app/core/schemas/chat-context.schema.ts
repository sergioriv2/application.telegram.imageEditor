import { Schema } from 'mongoose';

export interface IChatContext {
  telegramId: number;
  state: string;
}

export const chatContextSchema = new Schema<IChatContext>(
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
