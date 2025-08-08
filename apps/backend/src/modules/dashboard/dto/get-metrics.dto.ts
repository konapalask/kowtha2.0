import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from '@prisma/client';

export class GetMetricsDto {
  @ApiProperty({
    description: 'Start date for filtering metrics (YYYY-MM-DD)',
    required: false,
    example: '2024-01-01'
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fromDate must be in YYYY-MM-DD format'
  })
  fromDate?: string;

  @ApiProperty({
    description: 'End date for filtering metrics (YYYY-MM-DD)',
    required: false,
    example: '2024-12-31'
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'toDate must be in YYYY-MM-DD format'
  })
  toDate?: string;

  @ApiProperty({
    description: 'Department to filter metrics for specific department',
    required: true
  })
  @IsOptional()
  @IsEnum(Department)
  department: Department;
} 