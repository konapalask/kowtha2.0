import { SetMetadata } from '@nestjs/common';
import { UserRole, Department } from '@prisma/client';
import { RoleRequirement } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';

// Support both old format (UserRole[]) and new format (RoleRequirement[])
export const Roles = (...roles: (UserRole | RoleRequirement)[]) => SetMetadata(ROLES_KEY, roles);

// Helper decorator for department-specific roles
export const DepartmentRole = (role: UserRole, department: Department) => 
  SetMetadata(ROLES_KEY, [{ role, department }]);

// Helper decorator for any department role
export const AnyDepartmentRole = (role: UserRole) => 
  SetMetadata(ROLES_KEY, [{ role }]); 