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
    const result = await this.dashboardService.getHealthStatus();
    return {
      status: 200,
      message: result.status === 'healthy' ? 'Health check completed successfully' : 'Health check failed',
      data: result
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
} 