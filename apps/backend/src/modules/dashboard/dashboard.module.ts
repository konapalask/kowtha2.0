import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../../prisma.service';
import { LoggingModule } from '../common/logging/logging.module';
import { HealthController } from './health.controller';

@Module({
  imports: [LoggingModule],
  controllers: [DashboardController, HealthController],
  providers: [DashboardService, PrismaService],
})
export class DashboardModule {} 