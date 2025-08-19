import { Controller, Post, Body, UseGuards, Get, Request, Query, UnauthorizedException, Patch, Param, Put, BadRequestException, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles, DeptFromQuery, All, PD } from './decorators/roles.decorator';
import { AuthenticatedRequest } from '../common/types/request.types';
import { ListUsersDto } from './dto/list-users.dto';
import { ListAllUsersDto } from './dto/list-all-users.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserRole, Department } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseIntPipe } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { CreateDepartmentRoleDto } from './dto/create-department-role.dto';
import { UpdateDepartmentRoleDto } from './dto/update-department-role.dto';
import { UpdateUserDepartmentRolesDto } from './dto/update-user-department-roles.dto';

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
  async generateOTP(@Body() body: { mobile: string, isMobile?: Boolean }) {
    const result = await this.accountsService.generateOTP(body.mobile, body.isMobile || false);
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
  async verifyOTP(@Body() body: { mobile: string; otp: string; deviceId?: string }) {
    const result = await this.accountsService.verifyOTP(body.mobile, body.otp, body.deviceId);
    
    return {
      message: 'OTP verified successfully',
      accessToken: result?.accessToken,
      refreshToken: result?.refreshToken
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    const user = await this.accountsService.validateUser(req.user.id);
    return user;
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.OperationsExecutive, UserRole.Verifier)
  @ApiOperation({ summary: 'List all users with optional filters including department' })
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
              locality: { type: 'string' },
              departmentRole: {
                type: 'object',
                properties: {
                  department: { type: 'string', enum: ['FI', 'PD'] },
                  role: { type: 'string', enum: ['Admin', 'OperationsExecutive', 'FieldExecutive', 'Verifier', 'PDAdmin', 'PDFieldExecutive', 'PDVerifier', 'PDOperationsExecutive'] }
                },
                description: 'Department role for the filtered department (only present when department filter is applied)',
                nullable: true
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
  @ApiOperation({ summary: 'Create a new user with department roles' })
  @ApiResponse({ 
    status: 201, 
    description: 'User has been successfully created with department roles',
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
            locality: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            departmentRoles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  userId: { type: 'number' },
                  department: { type: 'string', enum: ['FI', 'PD'] },
                  role: { type: 'string', enum: ['Admin', 'OperationsExecutive', 'FieldExecutive', 'Verifier', 'PDAdmin', 'PDFieldExecutive', 'PDVerifier', 'PDOperationsExecutive'] },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      }
    }
  })
  async createUser(@Body() createUserDto: CreateUserDto, @Query('department') department: Department) {
    const user = await this.accountsService.createUser(createUserDto, department);
    return {
      message: 'User created successfully',
      data: user
    };
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(All)
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
            locality: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.accountsService.updateUser(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user
    };
  }

  @Post('users/department-roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Add a department role for a user' })
  @ApiQuery({ 
    name: 'department', 
    enum: Department, 
    description: 'Department to assign the role to (FI or PD)',
    example: 'FI'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Department role has been successfully created for the user',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Department role created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            userId: { type: 'number' },
            department: { type: 'string', enum: ['FI', 'PD'] },
            role: { type: 'string', enum: ['Admin', 'OperationsExecutive', 'FieldExecutive', 'Verifier', 'PDAdmin', 'PDFieldExecutive', 'PDVerifier', 'PDOperationsExecutive'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                mobile: { type: 'string' },
                email: { type: 'string' }
              }
            }
          }
        }
      }
    }
  })
  async createDepartmentRole(
    @Query('department') department: string,
    @Body() createDepartmentRoleDto: CreateDepartmentRoleDto,
  ) {
    // Validate department parameter
    if (!department || !Object.values(Department).includes(department as Department)) {
      throw new BadRequestException('Valid department parameter is required (FI or PD)');
    }

    const departmentRole = await this.accountsService.createDepartmentRole(
      department as Department,
      createDepartmentRoleDto
    );
    return {
      message: 'Department role created successfully',
      data: departmentRole
    };
    }

  @Patch('users/:id/department-roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update department roles for a user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Department roles have been successfully updated',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Department roles updated successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              userId: { type: 'number' },
              department: { type: 'string', enum: ['FI', 'PD'] },
              role: { type: 'string', enum: ['Admin', 'OperationsExecutive', 'FieldExecutive', 'Verifier', 'PDAdmin', 'PDFieldExecutive', 'PDVerifier', 'PDOperationsExecutive'] },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  mobile: { type: 'string' },
                  email: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  })
  async updateDepartmentRoles(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDepartmentRolesDto: UpdateUserDepartmentRolesDto,
  ) {
    const departmentRoles = await this.accountsService.updateUserDepartmentRoles(
      userId,
      updateUserDepartmentRolesDto
    );
    return {
      message: 'Department roles updated successfully',
      data: departmentRoles
    };
  }
   
 
  @Delete('users/:id/department-roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Delete a department role for a user' })
  @ApiQuery({ 
    name: 'department', 
    enum: Department, 
    description: 'Department to delete the role from (FI or PD)',
    example: 'FI'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Department role has been successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Department role deleted successfully' }
      }
    }
  })
  async deleteDepartmentRole(
    @Param('id', ParseIntPipe) userId: number,
    @Query('department') department: string,
  ) {
    // Validate department parameter
    if (!department || !Object.values(Department).includes(department as Department)) {
      throw new BadRequestException('Valid department parameter is required (FI or PD)');
    }

    const result = await this.accountsService.deleteDepartmentRole(
      userId,
      department as Department
    );
    return result;
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
  async createOffice(@Body() createOfficeDto: CreateOfficeDto, @Query('department') department: Department) {
    const office = await this.accountsService.createOffice(createOfficeDto, department);
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
  async listOffices(@Query('department') department: Department) {
    const offices = await this.accountsService.listOffices(department);
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
    return this.accountsService.getOrganizationByUser(req.user.id);
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
                  locality: { type: 'string' },
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