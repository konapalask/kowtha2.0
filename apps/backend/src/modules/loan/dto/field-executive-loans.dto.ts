import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { VerificationStatus } from '@prisma/client';

export class FieldExecutiveLoansDto {
  @ApiProperty({
    description: 'Filter by verification status',
    enum: VerificationStatus,
    required: false
  })
  @IsEnum(VerificationStatus)
  @IsOptional()
  status?: VerificationStatus;
} 