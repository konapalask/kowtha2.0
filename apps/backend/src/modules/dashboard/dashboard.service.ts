import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ApprovedStatus, LoanStatus, VerificationStatus } from '@prisma/client';
import { LoggingService } from '../common/logging/logging.service';
import { GetMetricsDto } from './dto/get-metrics.dto';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import gplay from 'google-play-scraper';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
  ) {}

  async getLoanMetrics(filters?: GetMetricsDto) {
    try {
      const where: any = {
        department: filters.department
      };

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
      // First, get the latest deployment from database
      let getDeployment = await this.prisma.appDeployment.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Try to fetch app details from Play Store
      let appDetails;
      
      try {
        appDetails = await gplay.app({ appId: 'com.beyondscale.kowthafi' });
      } catch (scraperError) {
        // Log scraper error but don't fail the entire request
        await this.loggingService.warn('Failed to scrape Play Store data', {
          error: scraperError.message,
          stack: scraperError.stack,
        });
        
        // If we have a cached deployment, return it
        if (getDeployment) {
          if (process.env.NODE_ENV === 'development') {
            getDeployment.playStoreUrl = null;
            getDeployment.version = null;
          }
          return getDeployment;
        }
        
        // No cached data and scraper failed - return a default response
        return {
          version: null,
          isActive: true,
          source: 'Google Play',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.beyondscale.kowthafi',
          forceUpdate: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      
      // If we have existing deployment with same version, return it
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
      
      // Create new deployment entry for new version
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

  // Bank CRUD operations
  async createBank(createBankDto: CreateBankDto) {
    try {
      // Check if bank with same name already exists
      const existingBank = await this.prisma.bank.findUnique({
        where: { name: createBankDto.name }
      });

      if (existingBank) {
        throw new BadRequestException('Bank with this name already exists');
      }

      const bank = await this.prisma.bank.create({
        data: createBankDto
      });

      await this.loggingService.info('Bank created successfully', {
        bankId: bank.id,
        bankName: bank.name,
      });

      return bank;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      await this.loggingService.error('Failed to create bank', {
        data: createBankDto,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getAllBanks() {
    try {
      const banks = await this.prisma.bank.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      await this.loggingService.info('All banks fetched successfully', {
        count: banks.length,
      });

      return banks;
    } catch (error) {
      await this.loggingService.error('Failed to fetch banks', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getBankById(id: number) {
    try {
      const bank = await this.prisma.bank.findUnique({
        where: { id }
      });

      if (!bank) {
        throw new NotFoundException('Bank not found');
      }

      return bank;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to fetch bank by ID', {
        bankId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateBank(id: number, updateBankDto: UpdateBankDto) {
    try {
      // Check if bank exists
      const existingBank = await this.prisma.bank.findUnique({
        where: { id }
      });

      if (!existingBank) {
        throw new NotFoundException('Bank not found');
      }

      // If name is being updated, check if it already exists
      if (updateBankDto.name && updateBankDto.name !== existingBank.name) {
        const bankWithSameName = await this.prisma.bank.findUnique({
          where: { name: updateBankDto.name }
        });

        if (bankWithSameName) {
          throw new BadRequestException('Bank with this name already exists');
        }
      }

      const updatedBank = await this.prisma.bank.update({
        where: { id },
        data: updateBankDto
      });

      await this.loggingService.info('Bank updated successfully', {
        bankId: id,
        updatedFields: Object.keys(updateBankDto),
      });

      return updatedBank;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      await this.loggingService.error('Failed to update bank', {
        bankId: id,
        data: updateBankDto,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async deleteBank(id: number) {
    try {
      // Check if bank exists
      const existingBank = await this.prisma.bank.findUnique({
        where: { id }
      });

      if (!existingBank) {
        throw new NotFoundException('Bank not found');
      }

      await this.prisma.bank.delete({
        where: { id }
      });

      await this.loggingService.info('Bank deleted successfully', {
        bankId: id,
        bankName: existingBank.name,
      });

      return { message: 'Bank deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to delete bank', {
        bankId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 