import { Module, Logger } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { PrismaService } from '../../prisma.service';
import { LoggingService } from '../common/logging/logging.service';

@Module({
  controllers: [LoanController],
  providers: [LoanService, PrismaService, LoggingService, Logger],
  exports: [LoanService],
})
export class LoanModule {} 