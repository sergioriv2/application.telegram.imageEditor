import TelegramBot from 'node-telegram-bot-api';

export interface CropImageContext {
  chatId: number;
  photo?: TelegramBot.ChatPhoto;
  document?: TelegramBot.Document;
}
