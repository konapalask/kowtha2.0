import { Module, forwardRef, Logger } from '@nestjs/common';
import { PDTemplateService } from './pd-templates.service';
import { LoggingModule } from '../common/logging/logging.module';
import { S3Module } from '../common/s3utils/s3.module';
import { LoanModule } from './loan.module';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from '../common/logging/logging.service';
import { LoanService } from './loan.service';

@Module({
  imports: [LoggingModule, S3Module, forwardRef(() => LoanModule)],
  providers: [PDTemplateService, PrismaService, LoggingService, LoanService, Logger],
  exports: [PDTemplateService],
})
export class PDTemplateModule {} 