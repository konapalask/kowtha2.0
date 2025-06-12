import { Controller, Post, Body, UseGuards, Get, Request, Query, UnauthorizedException, Patch, Param, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthenticatedRequest } from '../common/types/request.types';
import { ListUsersDto } from './dto/list-users.dto';
import { ListAllUsersDto } from './dto/list-all-users.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseIntPipe } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';

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
  async verifyOTP(@Body() body: { mobile: string; otp: string; isMobile: boolean }) {
    const result = await this.accountsService.verifyOTP(body.mobile, body.otp, body.isMobile);
    
    return {
      message: 'OTP verified successfully',
      accessToken: result?.accessToken,
      refreshToken: result?.refreshToken
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    const user = await this.accountsService.validateUser(req.user.sub);
    return {
      sub: user.id,
      mobile: user.mobile,
      role: user.role,
      officeId: user.officeId,
      employeeCode: user.employeeCode,
      name: user.name,
      email: user.email,
      status: user.status
    };
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
              pendingVerifications: { 
                type: 'number',
                description: 'Number of pending verifications assigned to the field executive'
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
      data: result.items
    };
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Access token has been successfully refreshed',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Token refreshed successfully' },
        accessToken: { 
          type: 'string',
          description: 'New JWT access token valid for 24 hours'
        }
      }
    }
  })
  async refreshToken(@Body() body: { refresh_token: string }) {
    if (!body.refresh_token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const result = await this.accountsService.refreshToken(body.refresh_token);
    return {
      message: 'Token refreshed successfully',
      accessToken: result.accessToken
    };
  }

  @Post('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User has been successfully created',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            mobile: { type: 'string' },
            email: { type: 'string' },
            employeeCode: { type: 'string' },
            role: { type: 'string', enum: ['Admin', 'OperationsExecutive', 'FieldExecutive', 'Verifier'] },
            officeId: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.accountsService.createUser(createUserDto);
    return {
      message: 'User created successfully',
      data: user
    };
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User has been successfully updated',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            mobile: { type: 'string' },
            email: { type: 'string' },
            employeeCode: { type: 'string' },
            role: { type: 'string', enum: ['Admin', 'OperationsExecutive', 'FieldExecutive', 'Verifier'] },
            officeId: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.accountsService.updateUser(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user
    };
  }

  @Post('offices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new office/branch' })
  @ApiResponse({ 
    status: 201, 
    description: 'Office has been successfully created',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Office created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            location: { type: 'string' },
            address: { type: 'string' },
            contactNumber: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async createOffice(@Body() createOfficeDto: CreateOfficeDto) {
    const office = await this.accountsService.createOffice(createOfficeDto);
    return {
      message: 'Office created successfully',
      data: office
    };
  }

  @Patch('offices/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update an existing office/branch' })
  @ApiResponse({ 
    status: 200, 
    description: 'Office has been successfully updated',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Office updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            location: { type: 'string' },
            address: { type: 'string' },
            contactNumber: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async updateOffice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfficeDto: UpdateOfficeDto
  ) {
    const office = await this.accountsService.updateOffice(id, updateOfficeDto);
    return {
      message: 'Office updated successfully',
      data: office
    };
  }

  @Get('offices')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all offices/branches' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of all offices',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Offices fetched successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              location: { type: 'string' },
              address: { type: 'string' },
              contactNumber: { type: 'string' },
              email: { type: 'string' },
              employees: { type: 'number', description: 'Number of employees in this office' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  async listOffices() {
    const offices = await this.accountsService.listOffices();
    return {
      message: 'Offices fetched successfully',
      data: offices
    };
  }

  @Get('offices/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get details of a specific office/branch' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the details of the specified office',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Office fetched successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            location: { type: 'string' },
            address: { type: 'string' },
            contactNumber: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async getOffice(@Param('id', ParseIntPipe) id: number) {
    const office = await this.accountsService.getOffice(id);
    return {
      message: 'Office fetched successfully',
      data: office
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('organization')
  async getOrganization(@Request() req: AuthenticatedRequest) {
    return this.accountsService.getOrganizationByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('organization/:id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string }
  ) {
    return this.accountsService.updateOrganization(Number(id), body);
  }

  @Get('all-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.OperationsExecutive, UserRole.Verifier)
  @ApiOperation({ summary: 'List all users with pagination and filters' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a paginated list of users matching the filter criteria',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Users fetched successfully' },
        data: {
          type: 'object',
          properties: {
            records: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  mobile: { type: 'string' },
                  email: { type: 'string' },
                  employeeCode: { type: 'string' },
                  role: { type: 'string', enum: ['Admin', 'OperationsExecutive', 'FieldExecutive', 'Verifier'] },
                  office: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' }
                    }
                  },
                  status: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async listAllUsers(@Query() filters: ListAllUsersDto) {
    const result = await this.accountsService.listAllUsers(filters);
    return {
      message: 'Users fetched successfully',
      data: {
        records: result.items,
        meta: result.meta
      }
    };
  }
} 