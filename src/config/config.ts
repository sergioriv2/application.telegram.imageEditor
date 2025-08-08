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
      AwsMongoDBAccessKey: process.env.AWS_DB_ACCESS_KEY_ID,
      AwsMongoDBSecretAccessKey: process.env.AWS_DB_SECRET_ACCESS_KEY_ID,
      AwsRegion: process.env.AWS_REGION,
      MongoDBAppName: process.env.MONGODB_APP_NAME,
      MongoDBClusterName: process.env.MONGODB_CLUSTER_NAME,
    };

    // Logger.log(LogMessages.CONFIGURE_COMPLETE);
  }
}
