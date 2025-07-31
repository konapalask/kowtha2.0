import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import * as crypto from 'crypto';
import { LoggingService } from '../common/logging/logging.service';
import { EditRequestStatus, EditRequestType, UserRole } from '@prisma/client';
import { ListUsersDto } from './dto/list-users.dto';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { ListAllUsersDto } from './dto/list-all-users.dto';
import { getUserWithDepartmentRoles } from '../common/types/request.types';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private loggingService: LoggingService,
    // private configService: ConfigService,
  ) {}

  private generateTokens(userId: number) {
    const payload = { id: userId };
    
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

      const org_name = 'Kowtha';

      const response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: 'dlt',
          sender_id: 'BYNSCL',
          message: '166906',
          language: 'english',
          variables_values: `${org_name}|${otp}`,
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

  async generateOTP(mobile: string, isMobile: Boolean): Promise<{ message: string }> {
    try {

      const user = await this.prisma.user.findUnique({
        where: { mobile },
      });

      if (!user) {
        throw new NotFoundException('Please use a valid number');
      }

      const userRoles = await getUserWithDepartmentRoles(this.prisma, user.id);

      const hasRole = userRoles.departmentRoles.some(r => r.role === UserRole.FieldExecutive || r.role === UserRole.PDFieldExecutive);

      if (isMobile && !hasRole) {
        throw new BadRequestException('Access denied: You are not authorized to login');
      }

      const otp = this.generateRandomOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

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

  async verifyOTP(mobile: string, otp: string, deviceId?: string): Promise<{ accessToken: string; refreshToken: string; message: string }> {
    try {

      const user = await this.prisma.user.findUnique({
        where: { mobile },
      });

      const userRoles = await getUserWithDepartmentRoles(this.prisma, user.id);

      await this.loggingService.info('User found', {
        user: user,
        mobile: mobile,
        otp: otp,
        deviceId: deviceId
      });

      if (!user) {
        throw new NotFoundException('Access denied: User not found with this mobile number');
      }

      const hasRole = userRoles.departmentRoles.some(r => r.role === UserRole.FieldExecutive || r.role === UserRole.PDFieldExecutive);

      if(hasRole && !deviceId){
        throw new UnauthorizedException('Access denied: Please contact administrator');
      }
      
      if(deviceId){

        if(!hasRole){
          throw new UnauthorizedException('Access denied: You are not Authorized to login');
        }

        let updateUser = null;

        if(!userRoles.deviceId){
          updateUser  = await this.prisma.user.update({
            where: { id: userRoles.id },
            data: { deviceId }
          });
          await this.loggingService.info('Device ID updated successfully', {
            userId: user.id,
          });
        }

        const newUserRoles = await getUserWithDepartmentRoles(this.prisma, user.id);


        if(deviceId !== newUserRoles.deviceId){
          const checkEditRequest = await this.prisma.editRequest.findFirst({
            where: {
              requester: {
                id: userRoles.id
              },
              type: EditRequestType.Login,
              status: EditRequestStatus.Pending
            }
          });

          if(checkEditRequest){
            throw new BadRequestException('Device change request already pending. Please wait for approval');
          }
          else{
            const editRequest = await this.prisma.editRequest.create({
              data: {
                requester: {
                  connect: { id: userRoles.id }
                },
                changes: {
                  newDeviceId: deviceId,
                  mobile: userRoles.mobile,
                  userName: userRoles.name,
                  officeId: userRoles.officeId,
                  oldDeviceId: userRoles.deviceId,
                  employeeCode: userRoles.employeeCode,
                },
                type: EditRequestType.Login,
                status: EditRequestStatus.Pending
              }
            });
            await this.loggingService.info('Device change request created', {
              userId: userRoles.id,
              deviceId,
              oldDeviceId: userRoles.deviceId,
              status: 'Pending',
            });
            throw new BadRequestException('Device has been changed. Please contact administrator');
          }          
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

      if ( process.env.DEV_OTP && otp === process.env.DEV_OTP) {
        const tokens = this.generateTokens(user.id);
      
      return { ...tokens, message: "OTP verified successfully" };
      }

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
      const tokens = this.generateTokens(user.id);
      
      return { ...tokens, message: "OTP verified successfully" };
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
      const user = await getUserWithDepartmentRoles(this.prisma, id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.status !== 'Active') {
        throw new BadRequestException('Your account is not active. Please contact administrator.');
      }

      await this.loggingService.debug('User validated successfully', { userId: id });
      return {
        id: user.id,
        mobile: user.mobile,
        role: user.departmentRoles[0].role,
        officeId: user.officeId,
        employeeCode: user.employeeCode,
        name: user.name,
        email: user.email,
        status: user.status,
        locality: user.locality,
        departmentRoles: user.departmentRoles,
      };
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

  async listUsers(filters?: ListUsersDto): Promise<{ items: any[] }> {
    try {
      const where: any = {
        status: filters?.status || 'Active'
      };
      
      if (filters?.role) {
        where.role = filters.role;
      }
      
      if (filters?.officeId) {
        where.officeId = Number(filters.officeId);
      }

      if (filters?.locality) {
        where.locality = {
          contains: filters.locality,
          mode: 'insensitive'
        };
      }

      const users = await this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          mobile: true,
          employeeCode: true,
          status: true,
          office: {
            select: {
              id: true,
              name: true
            }
          },
          createdAt: true,
          _count: {
            select: {
              verifications: {
                where: {
                  status: 'Pending'
                }
              }
            }
          },
          locality: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Transform the data to include pending verifications count and availabletoday flag
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const transformedUsers = await Promise.all(users.map(async user => {
        const attendance = await this.prisma.attendance.findFirst({
          where: {
            userId: user.id,
            date: {
              gte: today,
              lt: tomorrow
            }
          }
        });
        return {
          ...user,
          pendingVerifications: user._count.verifications,
          availabletoday: !!attendance,
          _count: undefined // Remove the _count field
        };
      }));

      await this.loggingService.info('Users listed successfully', {
        filter: filters,
        count: users.length
      });

      return {
        items: transformedUsers
      };
    } catch (error) {
      await this.loggingService.error('Failed to list users', {
        filter: filters,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async listAllUsers(filters?: ListAllUsersDto): Promise<PaginatedResponse<any>> {
    try {
      const where: any = {};
      
      if (filters?.role) {
        where.role = filters.role;
      }
      
      if (filters?.employeeCode) {
        where.employeeCode = {
          contains: filters.employeeCode,
          mode: 'insensitive'
        };
      }

      if (filters?.name) {
        where.name = {
          contains: filters.name,
          mode: 'insensitive'
        };
      }

      if (filters?.locality) {
        where.locality = {
          contains: filters.locality,
          mode: 'insensitive'
        };
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const skip = (page - 1) * limit;

      const total = await this.prisma.user.count({ where });

      const users = await this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          mobile: true,
          email: true,
          employeeCode: true,
          status: true,
          office: {
            select: {
              id: true,
              name: true
            }
          },
          createdAt: true,
          locality: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      });

      await this.loggingService.info('All users listed successfully', {
        filter: filters,
        count: users.length,
        page,
        limit
      });

      return {
        items: users,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      await this.loggingService.error('Failed to list all users', {
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
        where: { id: payload.id }
      });

      if (!user) {
        await this.loggingService.warn('Token refresh failed - User not found', { 
          userId: payload.id 
        });
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = this.jwtService.sign(
        { id: user.id },
        { expiresIn: '24h' }
      );

      await this.loggingService.info('Token refreshed successfully', { 
        userId: user.id,
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
      // Check if user with same mobile already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { mobile: createUserDto.mobile }
      });

      if (existingUser) {
        throw new ConflictException('User with this mobile number already exists');
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
        officeId: user.officeId,
      });

      return user;
    } catch (error) {
      await this.loggingService.error('Failed to create user', {
        userData: createUserDto,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // If mobile is being updated, check if it's already taken
      if (updateUserDto.mobile && updateUserDto.mobile !== user.mobile) {
        const existingUser = await this.prisma.user.findUnique({
          where: { mobile: updateUserDto.mobile }
        });

        if (existingUser) {
          throw new ConflictException('User with this mobile number already exists');
        }
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
        data: {
          ...(updateOfficeDto.name && {name: updateOfficeDto.name}),
          ...(updateOfficeDto.location && {location: updateOfficeDto.location}),
          ...(updateOfficeDto.address && {address: updateOfficeDto.address}),
          ...(updateOfficeDto.archived && {archived: updateOfficeDto.archived})
        },
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

  async getOrganizationByUser(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { office: true },
      });

      if (!user || !user.office) {
        await this.loggingService.warn('Organization not found for user', { userId });
        return null;
      }

      const org = await this.prisma.organization.findUnique({
        where: { id: user.office.organizationId },
      });

      await this.loggingService.debug('Retrieved organization for user', { 
        userId,
        organizationId: org?.id 
      });
      return org;
    } catch (error) {
      await this.loggingService.error('Failed to get organization by user', { 
        userId,
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  // Update organization name and description
  async updateOrganization(orgId: number, data: { name?: string; description?: string }) {
    try {
      const org = await this.prisma.organization.update({
        where: { id: orgId },
        data,
      });
      await this.loggingService.info('Organization updated successfully', { 
        organizationId: orgId,
        updatedFields: Object.keys(data) 
      });
      return org;
    } catch (error) {
      await this.loggingService.error('Failed to update organization', { 
        organizationId: orgId,
        data,
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }
} 