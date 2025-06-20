import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AccountsModule } from './modules/accounts/accounts.module';
import { LoanModule } from './modules/loan/loan.module';
import { OrgModule } from './modules/org/org.module';
import { LoggingModule } from './modules/common/logging/logging.module';
import { S3Module } from './modules/common/s3utils/s3.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EditRequestModule } from './modules/edit-request/edit-request.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
// import { ThrottlingModule } from './modules/common/throttling/throttling.module';

@Module({
  imports: [LoggingModule, AccountsModule, LoanModule, OrgModule, S3Module, DashboardModule, EditRequestModule, AttendanceModule],
  providers: [PrismaService],
})
export class AppModule {}