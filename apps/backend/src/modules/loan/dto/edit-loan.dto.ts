import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditLoanDto {
  @ApiProperty({ description: 'Applicant name', required: false })
  @IsString()
  @IsOptional()
  applicantName?: string;

  @ApiProperty({ description: 'Applicant mobile number', required: false })
  @IsString()
  @IsOptional()
  applicantMobile?: string;

  @ApiProperty({ description: 'Applicant address', required: false })
  @IsString()
  @IsOptional()
  applicantAddress?: string;

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

  @ApiProperty({ description: 'Loan type', required: false })
  @IsString()
  @IsOptional()
  loanType?: string;

  @ApiProperty({ description: 'Bank name', required: false })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({ description: 'Loan amount', required: false })
  @IsNumber()
  @IsOptional()
  loanAmount?: number;

  @ApiProperty({ description: 'Template name', required: false })
  @IsString()
  @IsOptional()
  templateName?: string;

  @ApiProperty({ description: 'Loan tag (free text, max 20 chars)', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  loanTag?: string;

  @ApiProperty({ description: 'Branch', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  branch?: string;

  @ApiProperty({ description: 'Date and time when the loan was closed', required: false, type: 'string', format: 'date-time' })
  @IsDateString()
  @IsOptional()
  closedAt?: string;
} 