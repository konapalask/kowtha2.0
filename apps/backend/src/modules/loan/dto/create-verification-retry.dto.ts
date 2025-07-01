import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVerificationRetryDto {
  @ApiProperty({ description: 'Verification ID for which retry is being created' })
  @IsNumber()
  verificationId: number;

  @ApiProperty({ description: 'Date of the retry attempt' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Geotag information for the retry', required: false })
  @IsString()
  @IsOptional()
  geotag?: string;

  @ApiProperty({ description: 'Address information for the retry', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Reason for the retry', required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ description: 'Field Executive ID who is creating the retry' })
  @IsNumber()
  fieldExecutiveId: number;
} 