import { IsString, IsEmail, IsEnum, IsNumber, IsOptional, IsArray, ValidateNested, MinLength, MaxLength } from 'class-validator';
import { UserRole, UserStatus, Department } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class DepartmentRoleDto {
  @ApiProperty({ description: 'Office ID where the user belongs' })
  @IsNumber()
  officeId: number;

  @ApiProperty({ 
    description: 'Department for this role',
    enum: Department,
    example: 'FI'
  })
  @IsEnum(Department)
  department: Department;

  @ApiProperty({ 
    description: 'Role for this department',
    enum: UserRole,
    example: 'OperationsExecutive'
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class CreateUserDto {
  @ApiProperty({ description: 'User\'s full name' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'User\'s mobile number' })
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  mobile: string;

  @ApiProperty({ description: 'User\'s email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'User\'s employee code', required: false })
  @IsString()
  @IsOptional()
  employeeCode?: string;

  @ApiProperty({ 
    description: 'User\'s status', 
    enum: UserStatus,
    default: UserStatus.Active,
    required: false 
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: "User's locality", required: false })
  @IsString()
  @IsOptional()
  locality?: string;

  @ApiProperty({ 
    description: 'Array of department roles for the user',
    type: [DepartmentRoleDto],
    example: [
      { department: 'FI', role: 'OperationsExecutive' },
      { department: 'PD', role: 'PDVerifier' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DepartmentRoleDto)
  departmentRoles: DepartmentRoleDto[];
} 