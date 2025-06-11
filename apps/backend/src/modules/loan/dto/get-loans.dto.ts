import { IsEnum, IsOptional, IsString } from 'class-validator';
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
} 