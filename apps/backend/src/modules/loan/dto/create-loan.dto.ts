import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { LoanStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ description: 'Application number', required: false })
  @IsString()
  @IsOptional()
  applicationNumber?: string;

  @ApiProperty({ description: 'Applicant name' })
  @IsString()
  applicantName: string;

  @ApiProperty({ description: 'Applicant mobile number' })
  @IsString()
  applicantMobile: string;

  @ApiProperty({ description: 'Applicant address' })
  @IsString()
  applicantAddress: string;

  @ApiProperty({ description: 'Applicant address line 1', required: false })
  @IsString()
  @IsOptional()
  applicantAddress1?: string;

  @ApiProperty({ description: 'Applicant address line 2', required: false })
  @IsString()
  @IsOptional()
  applicantAddress2?: string;

  @ApiProperty({ description: 'Type of applicant', required: false })
  @IsString()
  @IsOptional()
  applicantType?: string;

  @ApiProperty({ description: 'Whether the address is same as permanent address', required: false })
  @IsBoolean()
  @IsOptional()
  isAddressSame?: boolean;

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

  @ApiProperty({ description: 'Field executive ID', required: false })
  @IsNumber()
  @IsOptional()
  fieldExecutiveId?: number;

  @ApiProperty({ description: 'Loan status', enum: LoanStatus, required: false })
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