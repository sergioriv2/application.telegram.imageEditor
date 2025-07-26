import dotenv from 'dotenv';
import { TelegramBotService } from './services/telegram-bot-service';
import { ConfigurationProperties } from '../../config/config';
import { MongoDbService } from './services/mongodb-service';
import { ChatContextService } from './services/chat-context-service';
import { ChatContextRepository } from './repositories/chat-context-repository';
import { ImageService } from './services/image-service';
import { Logger } from './services/logger-service';

export class App {
  private configuration: ConfigurationProperties;
  private telegramBotService: TelegramBotService;
  private mongodbService: MongoDbService;
  private chatContextService: ChatContextService;
  private chatContextRepository: ChatContextRepository;
  private imageService: ImageService;

  constructor() {
    // Init Configurations
    dotenv.config();
    this.configuration = new ConfigurationProperties();

    // Repositories
    this.chatContextRepository = new ChatContextRepository();

    // Init Services
    this.mongodbService = new MongoDbService(this.configuration);
    this.mongodbService
      .init()
      .then(() => {
        this.chatContextService = new ChatContextService(this.chatContextRepository);
        this.telegramBotService = new TelegramBotService(
          this.configuration,
          this.chatContextService,
          this.imageService,
        );
      })
      .catch((error) => {
        Logger.log(`Error: ${error}`);
      });
  }

  async init() {
    try {
      // await this.mongodbService.init();
      this.telegramBotService.init();
    } catch (error) {
      Logger.log(`Error: ${error}`);
    }
  }
}
