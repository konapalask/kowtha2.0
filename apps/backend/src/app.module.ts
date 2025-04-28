import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { LoanModule } from './modules/loan/loan.module';
import { OrgModule } from './modules/org/org.module';

@Module({
  imports: [AuthModule, LoanModule, OrgModule],
  providers: [PrismaService],
})
export class AppModule {}