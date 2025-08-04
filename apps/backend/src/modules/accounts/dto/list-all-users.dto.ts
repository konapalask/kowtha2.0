import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Department, UserRole } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListAllUsersDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter users by employee code',
    required: false
  })
  @IsString()
  @IsOptional()
  employeeCode?: string;

  @ApiProperty({
    description: 'Filter users by name',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Filter users by role',
    enum: UserRole,
    required: false
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Filter users by locality',
    required: false
  })
  @IsString()
  @IsOptional()
  locality?: string;

  @ApiProperty({
    description: 'Filter users by department',
    required: true
  })
  @IsEnum(Department)
  department?: Department;
} 