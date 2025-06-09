import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import * as crypto from 'crypto';
import { LoggingService } from '../common/logging/logging.service';
import { UserRole } from '@prisma/client';
import { ListUsersDto } from './dto/list-users.dto';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
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
    
    // Generate access token (expires in 24 hours)
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
      const otp = "123456";
      // const otp = this.generateRandomOTP();
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

  async verifyOTP(mobile: string, otp: string, isMobile: boolean): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.prisma.user.findUnique({ where: { mobile } });
      if (!user) {
        await this.loggingService.warn('OTP verification failed - User not found', { mobile });
        throw new UnauthorizedException('User not found');
      }
      if(isMobile){
        if(user.role !== UserRole.FieldExecutive){
          throw new UnauthorizedException('Admin cannot verify OTP');
        }
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
      const where: any = {
        status: filters?.status || 'Active' // Default to Active users if not specified
      };
      
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
          employeeCode: true,
          status: true,
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

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      // Get the user from the database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      });

      if (!user) {
        await this.loggingService.warn('Token refresh failed - User not found', { 
          userId: payload.sub 
        });
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = this.jwtService.sign(
        { sub: user.id, mobile: user.mobile, role: user.role },
        { expiresIn: '24h' }
      );

      await this.loggingService.info('Token refreshed successfully', { 
        userId: user.id,
        role: user.role 
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      await this.loggingService.error('Failed to refresh token', { 
        error: error.message,
        stack: error.stack 
      });
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      // Check if mobile number already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { mobile: createUserDto.mobile },
      });

      if (existingUser) {
        throw new BadRequestException('Mobile number already registered');
      }

      // Check if email is provided and already exists
      if (createUserDto.email) {
        const existingEmail = await this.prisma.user.findUnique({
          where: { email: createUserDto.email },
        });

        if (existingEmail) {
          throw new BadRequestException('Email already registered');
        }
      }

      // Check if employee code is provided and already exists
      if (createUserDto.employeeCode) {
        const existingEmployeeCode = await this.prisma.user.findFirst({
          where: { employeeCode: createUserDto.employeeCode },
        });

        if (existingEmployeeCode) {
          throw new BadRequestException('Employee code already registered');
        }
      }

      // Check if office exists
      const office = await this.prisma.office.findUnique({
        where: { id: createUserDto.officeId },
      });

      if (!office) {
        throw new NotFoundException('Office not found');
      }

      // Create user
      const user = await this.prisma.user.create({
        data: createUserDto,
      });

      await this.loggingService.info('User created successfully', {
        userId: user.id,
        role: user.role,
        officeId: user.officeId,
      });

      return user;
    } catch (error) {
      await this.loggingService.error('Failed to create user', {
        data: createUserDto,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if email is being updated and already exists
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.prisma.user.findUnique({
          where: { email: updateUserDto.email },
        });

        if (existingEmail) {
          throw new BadRequestException('Email already registered');
        }
      }

      // Check if employee code is being updated and already exists
      if (updateUserDto.employeeCode && updateUserDto.employeeCode !== user.employeeCode) {
        const existingEmployeeCode = await this.prisma.user.findFirst({
          where: { employeeCode: updateUserDto.employeeCode },
        });

        if (existingEmployeeCode) {
          throw new BadRequestException('Employee code already registered');
        }
      }

      // Check if office exists if being updated
      if (updateUserDto.officeId) {
        const office = await this.prisma.office.findUnique({
          where: { id: updateUserDto.officeId },
        });

        if (!office) {
          throw new NotFoundException('Office not found');
        }
      }

      // Update user
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateUserDto,
      });

      await this.loggingService.info('User updated successfully', {
        userId,
        updatedFields: Object.keys(updateUserDto),
      });

      return updatedUser;
    } catch (error) {
      await this.loggingService.error('Failed to update user', {
        userId,
        data: updateUserDto,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createOffice(createOfficeDto: CreateOfficeDto) {
    try {
      // Check if office with same name already exists
      const existingOffice = await this.prisma.office.findFirst({
        where: { name: createOfficeDto.name },
      });

      if (existingOffice) {
        throw new BadRequestException('Office with this name already exists');
      }

      const office = await this.prisma.office.create({
        data: createOfficeDto,
      });

      await this.loggingService.info('Office created successfully', {
        officeId: office.id,
        name: office.name,
      });

      return office;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      await this.loggingService.error('Failed to create office', {
        data: createOfficeDto,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateOffice(officeId: number, updateOfficeDto: UpdateOfficeDto) {
    try {
      // Check if office exists
      const office = await this.prisma.office.findUnique({
        where: { id: officeId },
      });

      if (!office) {
        throw new NotFoundException('Office not found');
      }

      // If name is being updated, check if it already exists
      if (updateOfficeDto.name && updateOfficeDto.name !== office.name) {
        const existingOffice = await this.prisma.office.findFirst({
          where: { name: updateOfficeDto.name },
        });

        if (existingOffice) {
          throw new BadRequestException('Office with this name already exists');
        }
      }

      const updatedOffice = await this.prisma.office.update({
        where: { id: officeId },
        data: updateOfficeDto,
      });

      await this.loggingService.info('Office updated successfully', {
        officeId,
        updatedFields: Object.keys(updateOfficeDto),
      });

      return updatedOffice;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      await this.loggingService.error('Failed to update office', {
        officeId,
        data: updateOfficeDto,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async listOffices() {
    try {
      const offices = await this.prisma.office.findMany({
        orderBy: {
          name: 'asc',
        },
        include: {
          _count: {
            select: {
              users: true
            }
          }
        }
      });

      // Transform the data to include employees count
      const officesWithEmployeeCount = offices.map(office => ({
        ...office,
        employees: office._count.users,
        _count: undefined // Remove the _count field
      }));

      await this.loggingService.debug('Offices listed successfully', {
        count: offices.length,
      });

      return officesWithEmployeeCount;
    } catch (error) {
      await this.loggingService.error('Failed to list offices', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getOffice(officeId: number) {
    try {
      const office = await this.prisma.office.findUnique({
        where: { id: officeId },
      });

      if (!office) {
        throw new NotFoundException('Office not found');
      }

      return office;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      await this.loggingService.error('Failed to get office', {
        officeId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
} 