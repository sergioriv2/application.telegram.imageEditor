import mongoose from 'mongoose';
import { ConfigurationProperties } from '../../../config/config';
import { Logger } from './logger-service';
import { LogMessages } from '../../constants/logs-messages-constants';

export class MongoDbService {
  constructor(private configuration: ConfigurationProperties) {}

  async init(): Promise<void> {
    try {
      const user = this.configuration.properties.MongoDBUser;
      const secret = this.configuration.properties.MongoDBSecret;
      const cluster = this.configuration.properties.MongoDBCluster;
      const uri = `mongodb+srv://${user}:${secret}@${cluster}`;
      await mongoose.connect(uri);
      // this.client = new MongoClient(`mongodb+srv://${user}:${secret}@${cluster}`);
      Logger.log(LogMessages.DATABASE_COMPLETE);
    } catch (error) {
      console.log(error);
    }
  }
}
