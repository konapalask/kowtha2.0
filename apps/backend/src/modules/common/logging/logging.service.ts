import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('App');

  async info(message: string, context?: any) {
    this.logger.log(message, context);
  }

  async error(message: string, context?: any) {
    this.logger.error(message, context);
  }

  async warn(message: string, context?: any) {
    this.logger.warn(message, context);
  }

  async debug(message: string, context?: any) {
    this.logger.debug(message, context);
  }
} 