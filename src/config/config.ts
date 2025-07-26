import { ConfigModel } from '../app/core/models/config.model';
import dotenv from 'dotenv';
import { Logger } from '../app/core/services/logger-service';
import { LogMessages } from '../app/constants/logs-messages-constants';

export class ConfigurationProperties {
  properties: ConfigModel;

  constructor() {
    Logger.log(LogMessages.CONFIGURE_INIT);
    dotenv.config({ quiet: true, debug: false });

    this.properties = {
      TelegramApiToken: process.env.TELEGRAM_API_TOKEN,
      MongoDBSecret: process.env.MONGODB_SECRET,
      MongoDBUser: process.env.MONGODB_USER,
      MongoDBCluster: process.env.MONGODB_CLUSTER,
      MongoDbCollectionName: process.env.MONGODB_COLLECTION_NAME,
    };

    // Logger.log(LogMessages.CONFIGURE_COMPLETE);
  }
}
