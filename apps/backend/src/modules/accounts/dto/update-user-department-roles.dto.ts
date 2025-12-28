import { IsArray, ValidateNested, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole, Department } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class DepartmentRoleUpdateDto {
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

  @ApiProperty({ 
    description: 'Office ID for this department',
    type: Number,
    example: 1
  })
  @IsOptional()
  @IsNumber()
  officeId?: number;
}

export class UpdateUserDepartmentRolesDto {
  @ApiProperty({ 
    description: 'Array of department roles to update for the user',
    type: [DepartmentRoleUpdateDto],
    example: [
      { department: 'FI', role: 'OperationsExecutive', officeId: 1 }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DepartmentRoleUpdateDto)
  departmentRoles: DepartmentRoleUpdateDto[];
} 