import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { AttendanceStatus, UserRole } from '@prisma/client';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createAttendance(userId: number, createAttendanceDto: CreateAttendanceDto) {
    const { status = AttendanceStatus.Available, date } = createAttendanceDto;
    
    // Use current date if not provided
    const attendanceDate = new Date(date);
    
    if (attendanceDate.getDate() !== new Date(date).getDate() || attendanceDate.getMonth() !== new Date(date).getMonth() || attendanceDate.getFullYear() !== new Date(date).getFullYear()) {
      throw new BadRequestException('You can only record attendance for today');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.FieldExecutive) {
      throw new BadRequestException('Only field executives can record attendance');
    }

    // Check if attendance record already exists for this user and date
    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate()),
          lt: new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate() + 1)
        }
      }
    });

    if (existingAttendance) {
      throw new BadRequestException('Attendance record already exists for this date');
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        userId,
        date: attendanceDate,
        status
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobile: true,
            role: true
          }
        }
      }
    });

    return attendance;
  }

  async getAttendance(filters: GetAttendanceDto, currentUserId: number, currentUserRole: UserRole) {
    const { startDate, endDate, status, userId } = filters;
    
    // Set default date range to one month from today if not provided
    const today = new Date();
    const defaultStartDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    // Set end date to today in IST (UTC+5:30)
    const istToday = new Date(today.getTime() + (5.5 * 60 * 60 * 1000));
    const defaultEndDate = new Date(istToday.getFullYear(), istToday.getMonth(), istToday.getDate());
    
    const start = startDate ? new Date(startDate) : defaultStartDate;
    const end = endDate ? new Date(endDate) : defaultEndDate;

    // Build where clause for attendance records
    const attendanceWhereClause: any = {
      date: {
        gte: start,
        lte: end
      }
    };

    // Add status filter if provided
    if (status) {
      attendanceWhereClause.status = status;
    }

    // Get all field executives
    const fieldExecutives = await this.prisma.user.findMany({
      where: {
        role: UserRole.FieldExecutive,
        status: 'Active'
      },
      select: {
        id: true,
        name: true,
        mobile: true,
        role: true,
        employeeCode: true
      }
    });

    // Get all attendance records for the date range
    const allAttendanceRecords = await this.prisma.attendance.findMany({
      where: attendanceWhereClause,
      select: {
        userId: true,
        status: true,
        date: true
      }
    });

    // Get today's attendance records to check availability
    const todayStart = new Date(istToday.getFullYear(), istToday.getMonth(), istToday.getDate());
    const todayEnd = new Date(istToday.getFullYear(), istToday.getMonth(), istToday.getDate() + 1);
    
    const todayAttendanceRecords = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: todayStart,
          lt: todayEnd
        }
      },
      select: {
        userId: true,
        status: true
      }
    });

    // Get verification statistics for all field executives
    const fieldExecutiveIds = fieldExecutives.map(fe => fe.id);
    const verificationStats = await this.prisma.verification.groupBy({
      by: ['fieldExecutiveId', 'status'],
      where: {
        fieldExecutiveId: {
          in: fieldExecutiveIds
        },
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _count: {
        status: true
      }
    });

    // Calculate statistics for each field executive
    const userStatistics = fieldExecutives.map(fieldExecutive => {
      const userAttendance = allAttendanceRecords.filter(record => record.userId === fieldExecutive.id);
      const userVerifications = verificationStats.filter(stat => stat.fieldExecutiveId === fieldExecutive.id);
      
      // Check if user has attendance record for today
      const todayRecord = todayAttendanceRecords.find(record => record.userId === fieldExecutive.id);
      const availableToday = todayRecord ? todayRecord.status === AttendanceStatus.Available : false;
      
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const presentDays = userAttendance.filter(record => record.status === AttendanceStatus.Available).length;
      const absentDays = totalDays - presentDays;
      
      const totalAssigned = userVerifications.reduce((sum, stat) => sum + stat._count.status, 0);
      const completedVerifications = userVerifications.find(stat => stat.status === 'Completed')?._count.status || 0;
      const pendingVerifications = userVerifications.find(stat => stat.status === 'Pending')?._count.status || 0;
      const inProgressVerifications = userVerifications.find(stat => stat.status === 'InProgress')?._count.status || 0;

      return {
        userId: fieldExecutive.id,
        user: fieldExecutive,
        totalDays,
        presentDays,
        absentDays,
        totalAssigned,
        completedVerifications,
        pendingVerifications,
        inProgressVerifications,
        availableToday
      };
    });

    return {
      userStatistics,
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      }
    };
  }
} 