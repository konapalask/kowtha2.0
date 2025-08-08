import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, Department } from '@prisma/client';

export class CreateDepartmentRoleDto {
  @ApiProperty({
    description: 'User ID to assign the department role to',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Role to assign to the user in the department',
    enum: UserRole,
    example: UserRole.FieldExecutive
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
} 