import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { LoanStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ description: 'Applicant name' })
  @IsString()
  applicantName: string;

  @ApiProperty({ description: 'Applicant mobile number' })
  @IsString()
  @IsOptional()
  applicantMobile: string;

  @ApiProperty({ description: 'Applicant address' })
  @IsString()
  @IsOptional()
  applicantAddress?: string;

  @ApiProperty({ description: 'Whether current and permanent addresses are the same', default: false })
  @IsOptional()
  isAddressSame?: boolean;

  @ApiProperty({ description: 'Application number' })
  @IsString()
  applicationNumber?: string;

  @ApiProperty({ description: 'Loan type' })
  @IsString()
  @IsOptional()
  loanType?: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({ description: 'Loan amount' })
  @IsNumber()
  @IsOptional()
  loanAmount?: number;

  @ApiProperty({ description: 'Office ID' })
  @IsNumber()
  @IsOptional()
  officeId?: number;

  @ApiProperty({ description: 'Operations executive ID' })
  @IsNumber()
  @IsOptional()
  operationsExecutiveId?: number;

  @ApiProperty({ description: 'Loan status', enum: LoanStatus, default: LoanStatus.Unassigned })
  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Verification data', required: false })
  @IsNumber()
  @IsOptional()
  verifierId: any;
} 