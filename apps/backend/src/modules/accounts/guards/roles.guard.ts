import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, Department } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

export interface RoleRequirement {
  role: UserRole;
  department?: Department;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(UserRole | RoleRequirement)[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Admin can access everything
    if (user.departmentRoles?.some((dr: any) => dr.role === UserRole.Admin)) {
      return true;
    }

    // Convert old format to new format for consistency
    const normalizedRequirements: RoleRequirement[] = requiredRoles.map(role => {
      if (typeof role === 'string') {
        return { role: role as UserRole };
      }
      return role as RoleRequirement;
    });

    // Check if user has any of the required roles
    return normalizedRequirements.some(requirement => {
      return user.departmentRoles?.some((dr: any) => {
        const roleMatches = dr.role === requirement.role;
        const departmentMatches = !requirement.department || dr.department === requirement.department;
        return roleMatches && departmentMatches;
      });
    });
  }
} 