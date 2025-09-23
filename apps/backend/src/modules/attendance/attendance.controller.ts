import { Controller, Post, Body, UseGuards, Get, Request, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../accounts/jwt-auth.guard';
import { RolesGuard } from '../accounts/guards/roles.guard';
import { Roles } from '../accounts/decorators/roles.decorator';
import { AuthenticatedRequest } from '../common/types/request.types';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Department, UserRole } from '@prisma/client';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.FieldExecutive)
  @ApiOperation({ summary: 'Create attendance record for current user' })
  @ApiResponse({ 
    status: 201, 
    description: 'Attendance record has been successfully created',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Attendance recorded successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            userId: { type: 'number' },
            date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['Available', 'Unavailable'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                mobile: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        }
      }
    }
  })
  async createAttendance(
    @Request() req: AuthenticatedRequest,
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Query('department') department: Department
  ) {
    const attendance = await this.attendanceService.createAttendance(
      req.user.id,
      department,
      createAttendanceDto
    );
    
    return {
      message: 'Attendance recorded successfully',
      data: attendance
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.OperationsExecutive)
  @ApiOperation({ summary: 'Get attendance statistics for all field executives' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns attendance statistics for all field executives in the specified date range',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Attendance records fetched successfully' },
        data: {
          type: 'object',
          properties: {
            userStatistics: {
              type: 'array',
              description: 'Statistics for each field executive',
              items: {
                type: 'object',
                properties: {
                  userId: { type: 'number' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' },
                      mobile: { type: 'string' },
                      role: { type: 'string' }
                    }
                  },
                  totalDays: { type: 'number', description: 'Total days in the date range' },
                  presentDays: { type: 'number', description: 'Number of days present' },
                  absentDays: { type: 'number', description: 'Number of days absent' },
                  totalAssigned: { type: 'number', description: 'Total verifications assigned' },
                  completedVerifications: { type: 'number', description: 'Number of completed verifications' },
                  pendingVerifications: { type: 'number', description: 'Number of pending verifications' },
                  inProgressVerifications: { type: 'number', description: 'Number of in-progress verifications' },
                  availableToday: { type: 'boolean', description: 'Whether the user is available today' }
                }
              }
            },
            dateRange: {
              type: 'object',
              properties: {
                start: { type: 'string', example: '2024-01-01' },
                end: { type: 'string', example: '2024-01-31' }
              }
            }
          }
        }
      }
    }
  })
  async getAttendance(
    @Request() req: AuthenticatedRequest,
    @Query() filters: GetAttendanceDto
  ) {
    const result = await this.attendanceService.getAttendance(
      filters,
      req.user.id,
      req.user.role as UserRole
    );
    
    return {
      message: 'Attendance records fetched successfully',
      data: result
    };
  }
} 