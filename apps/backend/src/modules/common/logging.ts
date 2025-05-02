import { CloudWatchLogs } from 'aws-sdk';

const cloudWatchLogs = new CloudWatchLogs({
  region: process.env.AWS_REGION || 'us-east-1',
});

export interface LogEntry {
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  metadata?: Record<string, any>;
}

export class Logger {
  private logGroupName: string;
  private logStreamName: string;

  constructor(logGroupName: string, logStreamName: string) {
    this.logGroupName = logGroupName;
    this.logStreamName = logStreamName;
  }

  private async ensureLogGroupAndStream() {
    try {
      await cloudWatchLogs.createLogGroup({ logGroupName: this.logGroupName }).promise();
    } catch (error) {
      // Log group might already exist
    }

    try {
      await cloudWatchLogs.createLogStream({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
      }).promise();
    } catch (error) {
      // Log stream might already exist
    }
  }

  private async putLogEvent(entry: LogEntry) {
    await this.ensureLogGroupAndStream();

    const logEvent = {
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents: [
        {
          timestamp: Date.now(),
          message: JSON.stringify({
            level: entry.level,
            message: entry.message,
            metadata: entry.metadata || {},
          }),
        },
      ],
    };

    await cloudWatchLogs.putLogEvents(logEvent).promise();
  }

  async info(message: string, metadata?: Record<string, any>) {
    await this.putLogEvent({ level: 'info', message, metadata });
  }

  async error(message: string, metadata?: Record<string, any>) {
    await this.putLogEvent({ level: 'error', message, metadata });
  }

  async warn(message: string, metadata?: Record<string, any>) {
    await this.putLogEvent({ level: 'warn', message, metadata });
  }

  async debug(message: string, metadata?: Record<string, any>) {
    await this.putLogEvent({ level: 'debug', message, metadata });
  }
}

// Create a default logger instance
export const logger = new Logger(
  process.env.CLOUDWATCH_LOG_GROUP || 'default-log-group',
  process.env.CLOUDWATCH_LOG_STREAM || 'default-log-stream'
);
