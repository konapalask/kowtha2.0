import { IsString, IsObject, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApprovedStatus } from '@prisma/client';

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

  @ApiProperty({ description: 'Approved status', enum: ApprovedStatus })
  @IsEnum(ApprovedStatus)
  approvedStatus: ApprovedStatus;
} 