import { IsArray, ValidateNested, IsEnum } from 'class-validator';
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
}

export class UpdateUserDepartmentRolesDto {
  @ApiProperty({ 
    description: 'Array of department roles to update for the user',
    type: [DepartmentRoleUpdateDto],
    example: [
      { department: 'FI', role: 'OperationsExecutive' },
      { department: 'PD', role: 'PDVerifier' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DepartmentRoleUpdateDto)
  departmentRoles: DepartmentRoleUpdateDto[];
} 