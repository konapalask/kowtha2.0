import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { LoanStatus } from '@prisma/client';
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
      const verifiedLoans = await this.prisma.loan.count({
        where: { 
          ...where,
          status: LoanStatus.Approved 
        },
      });

      const rejectedLoans = await this.prisma.loan.count({
        where: { 
          ...where,
          status: LoanStatus.Rejected 
        },
      });

      const pendingLoans = await this.prisma.loan.count({
        where: {
          ...where,
          status: {
            in: [LoanStatus.Unassigned, LoanStatus.Assigned, LoanStatus.UnderFV, LoanStatus.FVCompleted],
          },
        },
      });

      // Calculate percentages
      const verifiedPercentage = totalLoans > 0 ? (verifiedLoans / totalLoans) * 100 : 0;
      const rejectedPercentage = totalLoans > 0 ? (rejectedLoans / totalLoans) * 100 : 0;
      const pendingPercentage = totalLoans > 0 ? (pendingLoans / totalLoans) * 100 : 0;

      await this.loggingService.info('Dashboard metrics fetched successfully', {
        filters,
        totalLoans,
        verifiedLoans,
        rejectedLoans,
        pendingLoans,
      });

      return {
        totalLoans,
        verifiedLoans,
        rejectedLoans,
        pendingLoans,
        percentages: {
          verified: Number(verifiedPercentage.toFixed(2)),
          rejected: Number(rejectedPercentage.toFixed(2)),
          pending: Number(pendingPercentage.toFixed(2)),
        },
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