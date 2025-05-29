import { IsString, IsEmail, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User\'s full name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'User\'s email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'User\'s employee code', required: false })
  @IsString()
  @IsOptional()
  employeeCode?: string;

  @ApiProperty({ description: 'User\'s role', enum: UserRole, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ description: 'Office ID where the user belongs', required: false })
  @IsNumber()
  @IsOptional()
  officeId?: number;
} 