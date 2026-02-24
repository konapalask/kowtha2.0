import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, Department, UserStatus } from '@prisma/client';
import { ROLES_KEY, All } from '../decorators/roles.decorator';

export interface RoleRequirement {
  role: UserRole;
  department?: Department;
  dynamicDepartment?: boolean;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(UserRole | RoleRequirement | typeof All)[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    // Department must come from query string
    const departmentFromQuery = request.query?.department;
    if (!departmentFromQuery) {
      throw new ForbiddenException('Missing department in query params');
    }
    const department = departmentFromQuery as Department;

    // Admins can access everything
    if (user.departmentRoles?.find((dr: any) => dr.department === department && dr.role === UserRole.Admin && dr.status === UserStatus.Active)) {
      return true;
    }

    // Check for special role requirements
    return requiredRoles.some(role => {
      // Handle 'All' - allows any role
      if (role === All) {
        return user.departmentRoles?.some((dr: any) => dr.department === department && dr.status === UserStatus.Active);
      }

      // Handle regular role requirements
      const normalizedRequirement: RoleRequirement = typeof role === 'string' 
        ? { role: role as UserRole } 
        : role as RoleRequirement;

      return user.departmentRoles?.some((dr: any) => {
        return dr.role === normalizedRequirement.role && dr.department === department && dr.status === UserStatus.Active;
      });
    });
  }
}
