import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { LoanStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ description: 'Applicant name' })
  @IsString()
  applicantName: string;

  @ApiProperty({ description: 'Applicant mobile number' })
  @IsString()
  applicantMobile: string;

  @ApiProperty({ description: 'Applicant address' })
  @IsString()
  applicantAddress: string;

  @ApiProperty({ description: 'Loan type' })
  @IsString()
  loanType: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  bankName: string;

  @ApiProperty({ description: 'Loan amount' })
  @IsNumber()
  loanAmount: number;

  @ApiProperty({ description: 'Office ID' })
  @IsNumber()
  officeId: number;

  @ApiProperty({ description: 'Operations executive ID' })
  @IsNumber()
  operationsExecutiveId: number;

  @ApiProperty({ description: 'Loan status', enum: LoanStatus, default: LoanStatus.Unassigned })
  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
} 