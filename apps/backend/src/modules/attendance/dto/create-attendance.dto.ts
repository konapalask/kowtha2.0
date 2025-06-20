import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'Attendance status',
    enum: AttendanceStatus,
    default: AttendanceStatus.Available
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus = AttendanceStatus.Available;

  @ApiProperty({
    description: 'Date for attendance record (ISO date string). Defaults to current date if not provided',
    required: false,
    example: '2024-01-15'
  })
  @IsDateString()
  @IsOptional()
  date?: string;
} 