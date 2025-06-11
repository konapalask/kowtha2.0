import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListUsersDto extends PaginationDto {
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
} 