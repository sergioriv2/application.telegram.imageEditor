import { ConfigModel } from "../app/models/config.model";
import dotenv from 'dotenv'

export class ConfigurationProperties {
    properties: ConfigModel;

    constructor() {
        dotenv.config();

        this.properties = {
            TelegramApiToken: process.env.TELEGRAM_API_TOKEN,
        }
    }
}