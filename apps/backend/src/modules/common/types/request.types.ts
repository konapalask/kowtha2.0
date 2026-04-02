import { Request } from 'express';
import { UserRole, Department, UserStatus } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    mobile: string;
    officeId?: number;
    department: Department;
    role: UserRole;
  };
}

export interface UserWithDepartmentRoles {
  id: number;
  mobile: string;
  name: string;
  email: string | null;
  employeeCode: string | null;
  locality: string | null;
  defaultDepartment: Department | null;
  deviceId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  departmentRoles: Array<{
    department: Department;
    role: UserRole;
    status: UserStatus;
    officeId?: number;
  }>;
}

// Utility function to be used within service classes
export async function getUserWithDepartmentRoles(
  prisma: any, // Using any to avoid circular dependency
  id: number,
): Promise<UserWithDepartmentRoles | null> {
  try {

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        departmentRoles: {
          select: {
            department: true,
            role: true,
            status: true,
            officeId: true
          }
        }
      }
    });

    return user as UserWithDepartmentRoles;
  } catch (error) {
    console.error('Error fetching user with department roles:', error);
    return null;
  }
} 