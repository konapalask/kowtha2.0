import { Controller, Post, Body, UseGuards, Get, Request, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthenticatedRequest } from '../common/types/request.types';
import { ListUsersDto } from './dto/list-users.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('otp/generate')
  @ApiOperation({ summary: 'Generate OTP for login' })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP has been successfully generated' 
  })
  async generateOTP(@Body() body: { mobile: string }) {
    const result = await this.accountsService.generateOTP(body.mobile);
    return {
      message: 'OTP generated successfully'
    };
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP and get access and refresh tokens' })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP has been successfully verified and tokens generated',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP verified successfully' },
        accessToken: { 
          type: 'string',
          description: 'JWT access token valid for 1 hour'
        },
        refreshToken: { 
          type: 'string',
          description: 'JWT refresh token valid for 7 days'
        }
      }
    }
  })
  async verifyOTP(@Body() body: { mobile: string; otp: string }) {
    const result = await this.accountsService.verifyOTP(body.mobile, body.otp);
    
    return {
      message: 'OTP verified successfully',
      accessToken: result?.accessToken,
      refreshToken: result?.refreshToken
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.OperationsExecutive, UserRole.Verifier)
  @ApiOperation({ summary: 'List all users with optional role filter' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of users matching the filter criteria',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Users fetched successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              mobile: { type: 'string' },
              role: { type: 'string', enum: ['Admin', 'OperationsExecutive', 'FieldExecutive', 'Verifier'] },
              office: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' }
                }
              },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  async listUsers(@Query() filters: ListUsersDto) {
    const result = await this.accountsService.listUsers(filters);
    return {
      message: 'Users fetched successfully',
      data: result
    };
  }
} 