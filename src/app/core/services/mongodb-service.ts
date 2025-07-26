import { MongoClient } from 'mongodb';
import { ConfigurationProperties } from '../../../config/config';
import { Logger } from './logger-service';
import { LogMessages } from '../../constants/logs-messages-constants';

export class MongoDbService {
  private client: MongoClient;

  constructor(configuration: ConfigurationProperties) {
    const user = configuration.properties.MongoDBUser;
    const secret = configuration.properties.MongoDBSecret;
    const cluster = configuration.properties.MongoDBCluster;
    const collectionName = configuration.properties.MongoDbCollectionName;

    this.client = new MongoClient(`mongodb+srv://${user}:${secret}@${cluster}/${collectionName}`);
  }

  async init(): Promise<void> {
    try {
      await this.client.connect();
      Logger.log(LogMessages.DATABASE_COMPLETE);
    } catch (error) {
      console.log(error);
    }
  }
}
