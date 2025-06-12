import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { LoanStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetLoansDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter loans by status',
    enum: LoanStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;

  @ApiProperty({
    description: 'Filter loans by application number',
    required: false
  })
  @IsOptional()
  @IsString()
  applicationNumber?: string;

  @ApiProperty({
    description: 'Search loans by field executive employee code',
    required: false
  })
  @IsOptional()
  @IsString()
  fieldExecutiveEmployeeCode?: string;

  @ApiProperty({
    description: 'Search loans by field executive name',
    required: false
  })
  @IsOptional()
  @IsString()
  fieldExecutiveName?: string;

  @ApiProperty({
    description: 'Filter loans created after this date (YYYY-MM-DD)',
    required: false,
    example: '2024-01-01'
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in YYYY-MM-DD format'
  })
  startDate?: string;

  @ApiProperty({
    description: 'Filter loans created before this date (YYYY-MM-DD)',
    required: false,
    example: '2024-12-31'
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in YYYY-MM-DD format'
  })
  endDate?: string;
} 