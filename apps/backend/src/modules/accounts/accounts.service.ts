import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import * as crypto from 'crypto';
import { LoggingService } from '../common/logging/logging.service';
import { UserRole } from '@prisma/client';
import { ListUsersDto } from './dto/list-users.dto';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private loggingService: LoggingService,
  ) {}

  async generateOTP(mobile: string): Promise<{ message: string }> {
    try {
      const otp = '123456'; // Hardcoded OTP for now
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      // Find or create user
      let user = await this.prisma.user.findUnique({ where: { mobile } });

      // Create a new session for this OTP
      await this.prisma.session.create({
        data: {
          userId: user.id,
          otp,
          otpExpires,
          isActive: true,
        },
      });

      // In production, send OTP via SMS service
      await this.loggingService.info('OTP generated successfully', { mobile, userId: user.id });
      return { message: 'OTP sent successfully' };
    } catch (error) {
      await this.loggingService.error('Failed to generate OTP', { 
        mobile, 
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  async verifyOTP(mobile: string, otp: string): Promise<{ token: string }> {
    try {
      const user = await this.prisma.user.findUnique({ where: { mobile } });
      if (!user) {
        await this.loggingService.warn('OTP verification failed - User not found', { mobile });
        throw new UnauthorizedException('User not found');
      }

      // Find the latest active session for this user
      const session = await this.prisma.session.findFirst({
        where: {
          userId: user.id,
          isActive: true,
          otp,
          otpExpires: { gte: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!session) {
        await this.loggingService.warn('OTP verification failed - Invalid or expired OTP', { 
          mobile, 
          userId: user.id 
        });
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      // Mark session as inactive and clear OTP
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          isActive: false,
          otp: null,
          otpExpires: null,
          lastLoginAt: new Date(),
        },
      });

      const payload = { sub: user.id, mobile: user.mobile, role: user.role };
      const token = this.jwtService.sign(payload);
      
      await this.loggingService.info('OTP verified successfully', { 
        mobile, 
        userId: user.id,
        role: user.role 
      });
      
      return { token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      await this.loggingService.error('Failed to verify OTP', { 
        mobile, 
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  async validateUser(id: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        await this.loggingService.warn('User validation failed - User not found', { userId: id });
        throw new UnauthorizedException('User not found');
      }

      await this.loggingService.debug('User validated successfully', { userId: id });
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      await this.loggingService.error('Failed to validate user', { 
        userId: id, 
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  async listUsers(filters?: ListUsersDto) {
    try {
      const where: any = {};
      
      if (filters?.role) {
        where.role = filters.role;
      }

      const users = await this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          mobile: true,
          role: true,
          office: {
            select: {
              id: true,
              name: true
            }
          },
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      await this.loggingService.info('Users listed successfully', {
        filter: filters,
        count: users.length
      });

      return users;
    } catch (error) {
      await this.loggingService.error('Failed to list users', {
        filter: filters,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
} 