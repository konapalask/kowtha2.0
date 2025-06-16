import { IsString, IsObject, IsOptional, IsArray } from 'class-validator';
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

  @ApiProperty({ 
    description: 'Array of paths to verification documents', 
    required: false,
    type: [String]
  })
  @IsString()
  @IsOptional()
  path?: string;
} 