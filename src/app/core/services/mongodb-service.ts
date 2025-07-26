import mongoose from 'mongoose';
import { ConfigurationProperties } from '../../../config/config';
import { Logger } from './logger-service';
import { LogMessages } from '../../constants/logs-messages-constants';

export class MongoDbService {
  constructor(private configuration: ConfigurationProperties) {}

  async init(): Promise<void> {
    try {
      const user = encodeURIComponent(this.configuration.properties.AwsMongoDBAccessKey);
      const secret = encodeURIComponent(this.configuration.properties.AwsMongoDBSecretAccessKey);
      const appName = this.configuration.properties.MongoDBAppName;
      const dbCluster = this.configuration.properties.MongoDBClusterName;

      const uri = `mongodb+srv://${user}:${secret}@${dbCluster}/`;
      await mongoose.connect(uri, {
        tls: true,
        authMechanism: 'MONGODB-AWS',
        retryWrites: true,
        authSource: '$external',
        appName,
      });
      Logger.log(LogMessages.DATABASE_COMPLETE);
    } catch (error) {
      console.log(error);
    }
  }
}
