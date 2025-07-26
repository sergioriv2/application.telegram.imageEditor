import { format } from 'date-fns';

export class Logger {
  static log(message: string): void {
    console.log(`[${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}] ====== ${message}`);
  }
}
