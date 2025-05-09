import { IsEnum, IsString, IsOptional } from 'class-validator';
import { LoanStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyLoanDto {
  @ApiProperty({ description: 'Verification status', enum: LoanStatus })
  @IsEnum(LoanStatus)
  status: LoanStatus;

  @ApiProperty({ description: 'Verification comments', required: false })
  @IsString()
  @IsOptional()
  comments?: string;
} 