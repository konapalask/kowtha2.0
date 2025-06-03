import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class ListUsersDto {
  @ApiProperty({
    description: 'Filter users by role',
    enum: UserRole,
    required: false
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Filter users by office ID',
    required: false
  })
  @IsNumber()
  @IsOptional()
  officeId?: number;

  @ApiProperty({
    description: 'Filter users by status',
    enum: UserStatus,
    required: false,
    default: UserStatus.Active
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
} 