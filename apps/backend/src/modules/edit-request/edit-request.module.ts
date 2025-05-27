import { Module } from '@nestjs/common';
import { EditRequestService } from './edit-request.service';
import { EditRequestController } from './edit-request.controller';
import { PrismaService } from '../../prisma.service';
import { LoggingService } from '../common/logging/logging.service';
import { S3Service } from '../common/s3utils/s3.service';

@Module({
  controllers: [EditRequestController],
  providers: [EditRequestService, PrismaService, LoggingService, S3Service],
  exports: [EditRequestService],
})
export class EditRequestModule {} 