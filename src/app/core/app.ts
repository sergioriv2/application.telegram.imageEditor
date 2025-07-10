
import dotenv from 'dotenv'
import { TelegramBotService } from '../services/telegram-bot-service';
import { ConfigurationProperties } from '../../config/config';

export class App {
    private configuration: ConfigurationProperties;
    private service: TelegramBotService;

    constructor() {
        // Init Configurations
        dotenv.config();
        this.configuration = new ConfigurationProperties();
    
        // Init Services
        this.service = new TelegramBotService(this.configuration)
    }

    public Init() {
        this.service.Init();
    }
}
