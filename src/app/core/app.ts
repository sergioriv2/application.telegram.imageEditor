import dotenv from 'dotenv';
import { TelegramBotService } from './services/telegram-bot-service';
import { ConfigurationProperties } from '../../config/config';
import { MongoDbService } from './services/mongodb-service';
import { ChatDetailService } from './services/chat-detail-service';
import { ChatDetailRepository } from './repositories/chat-detail-repository';
import { ImageService } from './services/image-service';

export class App {
  private configuration: ConfigurationProperties;
  private telegramBotService: TelegramBotService;
  private mongodbService: MongoDbService;
  private chatContextService: ChatDetailService;
  private chatDetailRepository: ChatDetailRepository;
  private imageService: ImageService;

  constructor() {
    // Init Configurations
    dotenv.config();
    this.configuration = new ConfigurationProperties();

    // Repositories
    this.chatDetailRepository = new ChatDetailRepository();

    // Init Services
    this.mongodbService = new MongoDbService(this.configuration);
    this.imageService = new ImageService();
    this.chatContextService = new ChatDetailService(this.chatDetailRepository);
    this.telegramBotService = new TelegramBotService(this.configuration, this.chatContextService, this.imageService);
  }

  async init() {
    try {
      await this.mongodbService.init();
      this.telegramBotService.init();
    } catch (error) {
      console.log({
        error,
      });
    }
  }
}
