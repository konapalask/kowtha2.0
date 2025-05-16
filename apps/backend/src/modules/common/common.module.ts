import { Module } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';
import { S3Service } from './s3utils/s3.service';
import { S3Controller } from './s3utils/s3.controller';

@Module({
  imports: [LoggingModule],
  providers: [S3Service],
  controllers: [S3Controller],
  exports: [S3Service],
})
export class CommonModule {} 