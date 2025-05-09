import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
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
} 