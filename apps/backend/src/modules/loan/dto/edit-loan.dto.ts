import { IsString, IsNumber, IsOptional } from 'class-validator';
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
} 