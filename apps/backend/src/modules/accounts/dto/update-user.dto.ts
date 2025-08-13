import { IsString, IsEmail, IsEnum, IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Department, UserRole, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User\'s full name', required: false })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'User\'s mobile number', required: false })
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @IsOptional()
  mobile?: string;

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

  @ApiProperty({ 
    description: 'User\'s status', 
    enum: UserStatus,
    required: false 
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: "User's locality", required: false })
  @IsString()
  @IsOptional()
  locality?: string;

  @ApiProperty({ description: 'User\'s default department', enum: Department, required: false })
  @IsEnum(Department)
  @IsOptional()
  defaultDepartment?: Department;
} 