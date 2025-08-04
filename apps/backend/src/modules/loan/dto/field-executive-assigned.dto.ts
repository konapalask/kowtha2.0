import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { VerificationStatus, Department } from '@prisma/client';
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

  @ApiProperty({
    description: 'Filter by department',
    enum: Department,
    required: true
  })
  @IsEnum(Department)
  department: Department;
} 