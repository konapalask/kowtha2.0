import { Module } from '@nestjs/common';
import { EditRequestService } from './edit-request.service';
import { EditRequestController } from './edit-request.controller';
import { PrismaService } from '../../prisma.service';
import { LoggingService } from '../common/logging/logging.service';

@Module({
  controllers: [EditRequestController],
  providers: [EditRequestService, PrismaService, LoggingService],
  exports: [EditRequestService],
})
export class EditRequestModule {} 