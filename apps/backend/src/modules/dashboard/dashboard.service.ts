import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ApprovedStatus, LoanStatus, VerificationStatus } from '@prisma/client';
import { LoggingService } from '../common/logging/logging.service';
import { GetMetricsDto } from './dto/get-metrics.dto';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
  ) {}

  async getHealthStatus() {
    try {
      // Check database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          server: 'running'
        }
      };

      await this.loggingService.info('Health check completed successfully', healthStatus);
      return healthStatus;
    } catch (error) {
      await this.loggingService.error('Health check failed', {
        error: error.message,
        stack: error.stack,
      });
      
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
          server: 'running'
        },
        error: error.message
      };
    }
  }

  async getLoanMetrics(filters?: GetMetricsDto) {
    try {
      const where: any = {};
      
      // Add date filters if provided
      if (filters?.fromDate || filters?.toDate) {
        where.createdAt = {};
        if (filters.fromDate) {
          // Set start of day for fromDate
          const fromDate = new Date(filters.fromDate);
          fromDate.setHours(0, 0, 0, 0);
          where.createdAt.gte = fromDate;
        }
        if (filters.toDate) {
          // Set end of day for toDate
          const toDate = new Date(filters.toDate);
          toDate.setHours(23, 59, 59, 999);
          where.createdAt.lte = toDate;
        }
      }

      // Get total loans count
      const totalLoans = await this.prisma.loan.count({ where });

      // Get counts for each status
      const totalVerifications = await this.prisma.verification.count({
        where: { 
          ...where,
          status: VerificationStatus.Completed 
        },
      });

      const rejectedVerifications = await this.prisma.verification.count({
        where: { 
          ...where,
          status: ApprovedStatus.Negative 
        },
      });

      const completedVerifications = await this.prisma.verification.count({
        where: {
          ...where,
          status: {
            in: [ApprovedStatus.Positive, ApprovedStatus.Negative]
          }
        },
      });

      await this.loggingService.info('Dashboard metrics fetched successfully', {
        filters,
        totalLoans,
        totalVerifications,
        completedVerifications,
        rejectedVerifications,
      });

      return {
        totalLoans,
        totalVerifications,
        completedVerifications,
        rejectedVerifications,
      };
    } catch (error) {
      await this.loggingService.error('Failed to fetch dashboard metrics', {
        filters,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 