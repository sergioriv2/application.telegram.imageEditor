import TelegramBot from "node-telegram-bot-api";
import { ConfigurationProperties } from "../../config/config";
import { CropImageMessage, StartMessage } from "../constants/response-constants";

export class TelegramBotService {
    private telegramBot: TelegramBot;

    constructor(configuration: ConfigurationProperties) {
        this.telegramBot = new TelegramBot(
            configuration.properties.TelegramApiToken,
            {
                polling: true,
            }
        );
    }

    Init(): void {
        // Matches === /start
        this.telegramBot.onText(/\/start/, (msg) => {
            const response = StartMessage.Response;
            this.telegramBot.sendMessage(msg.chat.id, response);
        })

        this.telegramBot.onText(/\/cropImage/, (msg) => {
            const response = CropImageMessage.Response;
            this.telegramBot.sendMessage(msg.chat.id, response);
        })

        // Matches === /echo {message}
        // Returns === {message}
        this.telegramBot.onText(/\/echo (.+)/, (msg, match) => {
            const response = match[1];

            this.telegramBot.sendMessage(msg.chat.id, response);
        })
    }
}
