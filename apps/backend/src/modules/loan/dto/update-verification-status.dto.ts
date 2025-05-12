import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { VerificationStatus, VerificationType } from '@prisma/client';

export class UpdateVerificationStatusDto {
  @ApiProperty({
    description: 'Type of verification',
    enum: VerificationType
  })
  @IsEnum(VerificationType)
  type: VerificationType;

  @ApiProperty({
    description: 'New status for the verification',
    enum: VerificationStatus
  })
  @IsEnum(VerificationStatus)
  status: VerificationStatus;
} 