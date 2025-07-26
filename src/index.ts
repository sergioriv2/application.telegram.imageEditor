import { LogMessages } from './app/constants/logs-messages-constants';
import { App } from './app/core/app';
import { Logger } from './app/core/services/logger-service';

Logger.log(LogMessages.ON_INIT);

const app = new App();
(async () => {
  await app.init();
})();
