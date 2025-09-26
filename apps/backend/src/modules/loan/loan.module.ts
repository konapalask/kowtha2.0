import { Module, Logger, forwardRef } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { PrismaService } from '../../prisma.service';
import { LoggingService } from '../common/logging/logging.service';
import { S3Module } from '../common/s3utils/s3.module';
import { CreateLoanController } from './create-loan.controller';
import { PDTemplateModule } from './templates/pd-template.module';

@Module({
  imports: [S3Module, forwardRef(() => PDTemplateModule)],
  controllers: [LoanController, CreateLoanController],
  providers: [LoanService, PrismaService, LoggingService, Logger],
  exports: [LoanService],
})
export class LoanModule {} 