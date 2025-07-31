import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, Department } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

export interface RoleRequirement {
  role: UserRole;
  department?: Department;
  dynamicDepartment?: boolean;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(UserRole | RoleRequirement)[]>(ROLES_KEY, [
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

    // Admins can access everything
    if (user.departmentRoles?.some((dr: any) => dr.role === UserRole.Admin)) {
      return true;
    }

    const normalizedRequirements: RoleRequirement[] = requiredRoles.map(role => {
      if (typeof role === 'string') {
        return { role: role as UserRole };
      }
      return role as RoleRequirement;
    });

    // Only allow if user has required role for department in query
    return normalizedRequirements.some(requirement => {
      return user.departmentRoles?.some((dr: any) => {
        return dr.role === requirement.role && dr.department === departmentFromQuery;
      });
    });
  }
}
