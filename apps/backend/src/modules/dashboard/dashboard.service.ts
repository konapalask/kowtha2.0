import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ApprovedStatus, LoanStatus, VerificationStatus } from '@prisma/client';
import { LoggingService } from '../common/logging/logging.service';
import { GetMetricsDto } from './dto/get-metrics.dto';
import gplay from 'google-play-scraper';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
  ) {}

  async getLoanMetrics(filters?: GetMetricsDto) {
    try {
      const where: any = {};
      
      if (filters.department) {
        where.department= filters.department
      }

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
          approvedStatus: ApprovedStatus.Negative 
        },
      });

      const completedVerifications = await this.prisma.verification.count({
        where: {
          ...where,
          approvedStatus: {
            in: [ApprovedStatus.Positive, ApprovedStatus.Negative]
          }
        },
      });

      const pendingVerifications = await this.prisma.verification.count({
        where: {
          ...where,
          status: {
            in: [VerificationStatus.Pending, VerificationStatus.InProgress]
          }
        },
      });

      await this.loggingService.info('Dashboard metrics fetched successfully', {
        filters,
        totalLoans,
        totalVerifications,
        completedVerifications,
        rejectedVerifications,
        pendingVerifications,
      });

      return {
        totalLoans,
        totalVerifications,
        completedVerifications,
        rejectedVerifications,
        pendingVerifications,
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

  async getAppDeployments() {
    try {
      const appDetails = await gplay.app({ appId: 'com.beyondscale.kowthafi' });

      let getDeployment = await this.prisma.appDeployment.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (getDeployment) {
        if (getDeployment.version === appDetails.version) {
          if (process.env.NODE_ENV === 'development') {
            getDeployment.playStoreUrl = null;
            getDeployment.version = null;
            return getDeployment;
          }
          return getDeployment;
        }
      }

      let createDeployment = await this.prisma.appDeployment.create({
        data: {
          version: appDetails.version,
          isActive: true,
          source: 'Google Play',
          playStoreUrl: appDetails.url,
          forceUpdate: true,
        }
      });

      await this.loggingService.info('Fetched app deployments', { createDeployment });
      
      if (process.env.NODE_ENV === 'development') {
        createDeployment.playStoreUrl = null;
        return createDeployment;
      }

      return createDeployment;
    } catch (error) {
      await this.loggingService.error('Failed to fetch app deployments', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 