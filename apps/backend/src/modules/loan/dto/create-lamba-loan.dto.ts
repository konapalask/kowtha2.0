import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLambdaLoanDto {
  @ApiProperty({ description: 'Application number', required: false })
  @IsString()
  applicationNumber: string;

  @ApiProperty({ description: 'Applicant name' })
  @IsString()
  applicantName: string;

  @ApiProperty({ description: 'Applicant mobile number' })
  @IsString()
  applicantMobile: string;

  @ApiProperty({ description: 'Applicant address' })
  @IsString()
  applicantAddress: string;

  @ApiProperty({ description: 'Type of applicant', required: false })
  @IsString()
  @IsOptional()
  applicantType?: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  bankName: string;

  @ApiProperty({ description: 'Loan amount' })
  @IsNumber()
  loanAmount: number;

}