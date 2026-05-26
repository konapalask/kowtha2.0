import { Module } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';
import { S3Module } from './s3utils/s3.module';

@Module({
  imports: [LoggingModule, S3Module],
  exports: [S3Module],
})
export class CommonModule {}
