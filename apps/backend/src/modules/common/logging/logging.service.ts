import { Injectable, Logger } from '@nestjs/common';
import { CloudWatch, CloudWatchLogs } from 'aws-sdk';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger();
  private cloudWatch: CloudWatch;
  private cloudWatchLogs: CloudWatchLogs;

  constructor() {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      const awsConfig = {
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      };
      this.cloudWatch = new CloudWatch(awsConfig);
      this.cloudWatchLogs = new CloudWatchLogs(awsConfig);
    }
  }

  async log(level: string, message: string, metadata?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...metadata,
    };

    if (process.env.NODE_ENV === 'development') {
      // Console logging for development
      switch (level) {
        case 'error':
          this.logger.error(message, metadata);
          break;
        case 'warn':
          this.logger.warn(message, metadata);
          break;
        case 'info':
          this.logger.log(message, metadata);
          break;
        case 'debug':
          this.logger.debug(message, metadata);
          break;
      }
    } else {
      // CloudWatch logging for staging/production
      try {
        await this.cloudWatch.putMetricData({
          Namespace: 'LoanVerification',
          MetricData: [{
            MetricName: level.toUpperCase(),
            Value: 1,
            Timestamp: new Date(),
            Dimensions: [
              {
                Name: 'Environment',
                Value: process.env.NODE_ENV,
              },
            ],
          }],
        }).promise();

        await this.cloudWatchLogs.putLogEvents({
          logGroupName: `/loan-verification/${process.env.NODE_ENV}`,
          logStreamName: new Date().toISOString().split('T')[0],
          logEvents: [{
            timestamp: Date.now(),
            message: JSON.stringify(logEntry),
          }],
        }).promise();
      } catch (error) {
        this.logger.error('Failed to send logs to CloudWatch', error);
      }
    }
  }

  async error(message: string, metadata?: any) {
    await this.log('error', message, metadata);
  }

  async warn(message: string, metadata?: any) {
    await this.log('warn', message, metadata);
  }

  async info(message: string, metadata?: any) {
    await this.log('info', message, metadata);
  }

  async debug(message: string, metadata?: any) {
    await this.log('debug', message, metadata);
  }
} 