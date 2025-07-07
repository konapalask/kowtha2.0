import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { RolesGuard } from '../accounts/guards/roles.guard';
import { Roles } from '../accounts/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMetricsDto } from './dto/get-metrics.dto';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('health-check')
  @UseGuards()
  @ApiOperation({ summary: 'Check server health status' })
  @ApiResponse({
    status: 200,
    description: 'Returns server health status including database connectivity',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Health check completed successfully' },
        data: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['healthy', 'unhealthy'] },
            timestamp: { type: 'string', format: 'date-time' },
            services: {
              type: 'object',
              properties: {
                database: { type: 'string', enum: ['connected', 'disconnected'] },
                server: { type: 'string', enum: ['running'] }
              }
            },
            error: { type: 'string', nullable: true }
          }
        }
      }
    }
  })
  async getHealthStatus() {
    return {
      status: 200,
      message: 'Health check completed successfully',
    };
  }

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
} 