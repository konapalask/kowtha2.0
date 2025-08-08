import { IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateDepartmentRoleDto {
  @ApiProperty({
    description: 'Role to assign to the user in the department',
    enum: UserRole,
    example: UserRole.FieldExecutive,
    required: true
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
} 