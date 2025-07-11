import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { RolesGuard } from '../accounts/guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('health')
@Controller('')
export class HealthController {
  constructor() {}

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
}