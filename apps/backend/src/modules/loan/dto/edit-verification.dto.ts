import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditVerificationDto {
  @ApiProperty({ description: 'Verification findings', required: false })
  @IsString()
  @IsOptional()
  findings?: string;

  @ApiProperty({ description: 'Verification data', required: false })
  @IsObject()
  @IsOptional()
  verificationData?: any;

  @ApiProperty({ description: 'Path to verification document', required: false })
  @IsString()
  @IsOptional()
  path?: string;
} 