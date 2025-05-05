import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AccountsModule } from './modules/accounts/accounts.module';
import { LoanModule } from './modules/loan/loan.module';
import { OrgModule } from './modules/org/org.module';
import { LoggingModule } from './modules/common/logging/logging.module';
// import { ThrottlingModule } from './modules/common/throttling/throttling.module';

@Module({
  imports: [LoggingModule, AccountsModule, LoanModule, OrgModule],
  providers: [PrismaService],
})
export class AppModule {}