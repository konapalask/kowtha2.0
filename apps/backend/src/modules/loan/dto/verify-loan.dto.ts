import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApprovedStatus, LoanStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyLoanDto {
  @ApiProperty({ description: 'Verification status', enum: LoanStatus })
  @IsEnum(LoanStatus)
  status: LoanStatus;

  @ApiProperty({ description: 'Approved status', enum: ApprovedStatus })
  @IsEnum(ApprovedStatus)
  approvedStatus: ApprovedStatus;

  @ApiProperty({ description: 'Verification comments', required: false })
  @IsString()
  @IsOptional()
  comments?: string;
} 