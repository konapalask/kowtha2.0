import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class GetAttendanceDto {
  @ApiProperty({
    description: 'Start date for filtering attendance records (ISO date string)',
    required: false,
    example: '2024-01-01'
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering attendance records (ISO date string)',
    required: false,
    example: '2024-01-31'
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Filter by attendance status',
    enum: AttendanceStatus,
    required: false
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @ApiProperty({
    description: 'User ID to filter attendance records for specific user',
    required: false
  })
  @IsOptional()
  userId?: number;
} 