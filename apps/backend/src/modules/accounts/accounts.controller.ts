import { Controller, Post, Body, UseGuards, Get, Request, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/request.types';
import { ListUsersDto } from './dto/list-users.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
      status: 200,
      message: 'OTP generated successfully',
      data: result
    };
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP and get JWT token' })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP has been successfully verified and token generated' 
  })
  async verifyOTP(@Body() body: { mobile: string; otp: string }) {
    const result = await this.accountsService.verifyOTP(body.mobile, body.otp);
    return {
      status: 200,
      message: 'OTP verified successfully',
      data: result
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all users with optional role filter' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of users matching the filter criteria',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Users fetched successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              mobile: { type: 'string' },
              role: { type: 'string', enum: ['ADMIN', 'OPERATIONS_EXECUTIVE', 'FIELD_EXECUTIVE', 'VERIFIER'] },
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
      status: 200,
      message: 'Users fetched successfully',
      data: result
    };
  }
} 