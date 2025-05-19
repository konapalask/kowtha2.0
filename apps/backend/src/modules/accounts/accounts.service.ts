import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import * as crypto from 'crypto';
import { LoggingService } from '../common/logging/logging.service';
import { UserRole } from '@prisma/client';
import { ListUsersDto } from './dto/list-users.dto';
import axios from 'axios';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private loggingService: LoggingService,
    // private configService: ConfigService,
  ) {}

  private generateTokens(userId: number, mobile: string, role: UserRole) {
    const payload = { sub: userId, mobile, role };
    
    // Generate access token (expires in 1 hour)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h'
    });

    // Generate refresh token (expires in 7 days)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d'
    });

    return { accessToken, refreshToken };
  }

  private generateRandomOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOTPViaSMS(mobile: string, otp: string): Promise<void> {
    try {
      const fast2smsApiKey = process.env.FAST2SMS_API_KEY;
      if (!fast2smsApiKey) {
        throw new Error('FAST2SMS_API_KEY is not configured');
      }
      
      const response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: 'dlt',
          sender_id: 'BYNSCL',
          message: '166906',
          language: 'english',
          variables_values: `${mobile}|${otp}`,
          flash: 0,
          numbers: mobile,
        },
        {
          headers: {
            'authorization': fast2smsApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.return === false) {
        throw new Error(`SMS sending failed: ${response.data.message}`);
      }
      
      await this.loggingService.info('SMS sent successfully', {
        mobile,
        messageId: response.data.request_id,
      });
    } catch (error) {
      await this.loggingService.error('Failed to send SMS', {
        mobile,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async generateOTP(mobile: string): Promise<{ message: string }> {
    try {
      // Generate a random 6-digit OTP
      // const otp = this.generateRandomOTP();
      const otp = "123456";
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Find or create user
      let user = await this.prisma.user.findUnique({ where: { mobile } });
      if (!user) {
        await this.loggingService.warn('OTP generation failed - User not found', { mobile });
        throw new UnauthorizedException('User not found');
      }
      
      // Create a new session for this OTP
      await this.prisma.session.create({
        data: {
          userId: user.id,
          otp,
          otpExpires,
          isActive: true,
        },
      });

      // Send OTP via Fast2SMS
      await this.sendOTPViaSMS(mobile, otp);

      await this.loggingService.info('OTP generated and sent successfully', { 
        mobile, 
        userId: user.id 
      });

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

  async verifyOTP(mobile: string, otp: string): Promise<{ accessToken: string; refreshToken: string }> {
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

      // Generate both tokens
      const tokens = this.generateTokens(user.id, user.mobile, user.role);
      
      await this.loggingService.info('OTP verified successfully', { 
        mobile, 
        userId: user.id,
        role: user.role 
      });
      
      return tokens;
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

      if (filters?.officeId) {
        where.officeId = Number(filters.officeId);
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