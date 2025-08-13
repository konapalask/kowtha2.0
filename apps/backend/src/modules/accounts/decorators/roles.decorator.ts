import { SetMetadata } from '@nestjs/common';
import { UserRole, Department } from '@prisma/client';
import { RoleRequirement } from '../guards/roles.guard';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Special role constants
export const All = 'ALL' as const;
export const PD = 'PD' as const;

export type RoleRequirementExtended = RoleRequirement | typeof All | typeof PD;

export const DeptFromQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.query.department?.toString(); 
  },
);

// Support both old format (UserRole[]), new format (RoleRequirement[]), and special cases (All, PD)
export const Roles = (...roles: (UserRole | RoleRequirement | typeof All | typeof PD)[]) => SetMetadata(ROLES_KEY, roles);

// Helper decorator for department-specific roles
export const DepartmentRole = (role: UserRole, department: Department) => 
  SetMetadata(ROLES_KEY, [{ role, department }]);

// Helper decorator for any department role
export const AnyDepartmentRole = (role: UserRole) => 
  SetMetadata(ROLES_KEY, [{ role }]); 