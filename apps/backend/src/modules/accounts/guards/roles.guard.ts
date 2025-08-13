import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, Department } from '@prisma/client';
import { ROLES_KEY, All, PD } from '../decorators/roles.decorator';

export interface RoleRequirement {
  role: UserRole;
  department?: Department;
  dynamicDepartment?: boolean;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(UserRole | RoleRequirement | typeof All | typeof PD)[]>(ROLES_KEY, [
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
    if (user.departmentRoles?.find((dr: any) => dr.department === departmentFromQuery && dr.role === UserRole.Admin)) {
      return true;
    }

    // Check for special role requirements
    return requiredRoles.some(role => {
      // Handle 'All' - allows any role
      if (role === All) {
        return user.departmentRoles && user.departmentRoles.length > 0;
      }
      
      // Handle 'PD' - allows any PD role
      if (role === PD) {
        return user.departmentRoles?.some((dr: any) => 
          dr.department === Department.PD && 
          [UserRole.PDAdmin, UserRole.PDFieldExecutive, UserRole.PDVerifier, UserRole.PDOperationsExecutive].includes(dr.role)
        );
      }

      // Handle regular role requirements
      const normalizedRequirement: RoleRequirement = typeof role === 'string' 
        ? { role: role as UserRole } 
        : role as RoleRequirement;

      return user.departmentRoles?.some((dr: any) => {
        return dr.role === normalizedRequirement.role && dr.department === departmentFromQuery;
      });
    });
  }
}
