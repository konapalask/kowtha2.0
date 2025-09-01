import { Controller, Get, Post, Patch, Delete, UseGuards, Query, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { RolesGuard } from '../accounts/guards/roles.guard';
import { Roles } from '../accounts/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetMetricsDto } from './dto/get-metrics.dto';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('metrics')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Get loan metrics for dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Returns loan metrics including counts and percentages',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Dashboard metrics fetched successfully' },
        data: {
          type: 'object',
          properties: {
            totalLoans: { type: 'number' },
            verifiedLoans: { type: 'number' },
            rejectedLoans: { type: 'number' },
            pendingLoans: { type: 'number' },
            percentages: {
              type: 'object',
              properties: {
                verified: { type: 'number' },
                rejected: { type: 'number' },
                pending: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  async getLoanMetrics(@Query() filters: GetMetricsDto) {
    const result = await this.dashboardService.getLoanMetrics(filters);
    return {
      status: 200,
      message: 'Dashboard metrics fetched successfully',
      data: result
    };
  }

  @Get('app-deployments')
  @ApiOperation({ summary: 'Get all app deployment records' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of app deployments',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'App deployments fetched successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              version: { type: 'string' },
              isActive: { type: 'boolean' },
              source: { type: 'string' },
              forceUpdate: { type: 'boolean' },
              appStoreUrl: { type: 'string', nullable: true },
              playStoreUrl: { type: 'string', nullable: true },
              description: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  async getAppDeployments() {
    const deployments = await this.dashboardService.getAppDeployments();
    return {
      status: 200,
      message: 'App deployments fetched successfully',
      data: deployments
    };
  }

  // Bank CRUD endpoints
  @Post('banks')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Create a new bank' })
  @ApiResponse({
    status: 201,
    description: 'Bank created successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Bank created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            logo: { type: 'string', nullable: true },
            parent: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Bank name already exists' })
  async createBank(@Body() createBankDto: CreateBankDto) {
    const bank = await this.dashboardService.createBank(createBankDto);
    return {
      status: 201,
      message: 'Bank created successfully',
      data: bank
    };
  }

  @Get('banks')
  @ApiOperation({ summary: 'Get all banks' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all banks',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Banks fetched successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              logo: { type: 'string', nullable: true },
              parent: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  async getAllBanks() {
    const banks = await this.dashboardService.getAllBanks();
    return {
      status: 200,
      message: 'Banks fetched successfully',
      data: banks
    };
  }

  @Get('banks/:id')
  @ApiOperation({ summary: 'Get bank by ID' })
  @ApiParam({ name: 'id', description: 'Bank ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Returns bank details',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Bank fetched successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            logo: { type: 'string', nullable: true },
            parent: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async getBankById(@Param('id', ParseIntPipe) id: number) {
    const bank = await this.dashboardService.getBankById(id);
    return {
      status: 200,
      message: 'Bank fetched successfully',
      data: bank
    };
  }

  @Patch('banks/:id')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Update bank by ID' })
  @ApiParam({ name: 'id', description: 'Bank ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Bank updated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Bank updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            logo: { type: 'string', nullable: true },
            parent: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Bank name already exists' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async updateBank(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBankDto: UpdateBankDto
  ) {
    const bank = await this.dashboardService.updateBank(id, updateBankDto);
    return {
      status: 200,
      message: 'Bank updated successfully',
      data: bank
    };
  }

  @Delete('banks/:id')
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Delete bank by ID' })
  @ApiParam({ name: 'id', description: 'Bank ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Bank deleted successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Bank deleted successfully' },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Bank deleted successfully' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async deleteBank(@Param('id', ParseIntPipe) id: number) {
    const result = await this.dashboardService.deleteBank(id);
    return {
      status: 200,
      message: 'Bank deleted successfully',
      data: result
    };
  }
} 