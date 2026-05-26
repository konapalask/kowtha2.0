import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { CloudFrontService } from './cloudfront.service';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  providers: [CloudFrontService, S3Service],
  controllers: [S3Controller],
  exports: [S3Service, CloudFrontService],
})
export class S3Module {}
