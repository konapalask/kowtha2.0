import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { LocationType, VerificationType } from '@prisma/client';

export class createAssignmentDto {
  @ApiProperty({
    description: 'Type of verification',
    enum: VerificationType,
    required: false
  })
  @IsEnum(VerificationType)
  @IsOptional()
  verificationType?: VerificationType;

  @ApiProperty({
    description: 'Location type',
    enum: LocationType,
    required: false
  })
  @IsEnum(LocationType)
  @IsOptional()
  locationType?: LocationType;

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
    description: 'Business name for Business verification',
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
} 