import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
  @IsString()
  @IsOptional()
  officeId?: string;

  @ApiProperty({
    description: 'Filter users by status',
    enum: UserStatus,
    required: false,
    default: UserStatus.Active
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    description: 'Filter users by locality',
    required: false
  })
  @IsString()
  @IsOptional()
  locality?: string;
} 