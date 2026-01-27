import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { VerificationType } from '@prisma/client';

export class UpdateAssignmentDto {
  @ApiProperty({
    description: 'Type of verification',
    enum: VerificationType,
    required: false
  })
  @IsEnum(VerificationType)
  @IsOptional()
  verificationType?: VerificationType;

  @ApiProperty({
    description: 'ID of the field executive to assign',
    required: false
  })
  @IsNumber()
  @IsOptional()
  fieldExecutiveId?: number;

  @ApiProperty({
    description: 'Address for verification',
    required: false
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'ID of the verifier to assign to the loan',
    required: false
  })
  @IsNumber()
  @IsOptional()
  verifierId?: number;

  @ApiProperty({
    description: 'Business name for verification',
    required: false
  })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({
    description: 'Office name for Work verification',
    required: false
  })
  @IsString()
  @IsOptional()
  currentOfficeName?: string;

  @ApiProperty({
    description: 'ID of the assistant verifier to assign to the loan',
    required: false
  })
  @IsNumber()
  @IsOptional()
  assistantVerifierId?: number;
} 