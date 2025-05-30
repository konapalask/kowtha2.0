import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { VerificationType } from '@prisma/client';

export class AssignFieldExecutiveDto {
  @ApiProperty({
    description: 'Type of verification',
    enum: VerificationType
  })
  @IsEnum(VerificationType)
  verificationType: VerificationType;

  @ApiProperty({
    description: 'ID of the field executive to assign'
  })
  @IsNumber()
  fieldExecutiveId: number;

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
} 