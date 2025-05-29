import { IsString, IsEmail, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User\'s full name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User\'s mobile number' })
  @IsString()
  mobile: string;

  @ApiProperty({ description: 'User\'s email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'User\'s employee code', required: false })
  @IsString()
  @IsOptional()
  employeeCode?: string;

  @ApiProperty({ description: 'User\'s role', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'Office ID where the user belongs' })
  @IsNumber()
  officeId: number;
} 