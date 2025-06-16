import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { VerificationStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FieldExecutiveAssignedDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter by verification status',
    enum: VerificationStatus,
    required: false
  })
  @IsEnum(VerificationStatus)
  @IsOptional()
  status?: VerificationStatus;

  @ApiProperty({
    description: 'Filter by application number',
    required: false
  })
  @IsString()
  @IsOptional()
  applicationNumber?: string;
} 