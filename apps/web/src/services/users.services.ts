import axiosInstance from "../config/axios.config";
import { getWithDepartment, postWithDepartment, patchWithDepartment } from "./api.services";

export interface UserFilters {
  employeeCode?: string;
  name?: string;
  role?: string;
}

export const getUsersApi = async (page?: number, limit?: number, filters?: UserFilters) => {
  return getWithDepartment("/accounts/all-users", {
    params: {
      page,
      limit,
      ...filters
    }
  });
};

export const getFieldExecutivesByOfficeIdApi = async (officeId: string) => {
  return getWithDepartment(`/accounts/users`, {
    params: {
      role: "FieldExecutive",
      officeId: officeId
    }
  });
};

export const getVerifiersApi = async () => {
  return getWithDepartment("/accounts/users", {
    params: {
      role: "Verifier"
    }
  });
};

export const createUserApi = async (userData: any) => {
  try {
    // Step 1: Create user without role
    const department = userData.defaultDepartment || userData.department;
    const createUserResponse = await postWithDepartment(
      "/accounts/users/",
      {
        name: userData.name,
        mobile: userData.mobile,
        email: userData.email,
        departmentRoles: userData.department_roles,
        employeeCode: userData.employeeCode,
        officeId: userData.officeId,
        status: userData.status || "Active",
        locality: userData.locality
      },
      { params: { department } }
    );

    // Step 2: Assign role to the created user using the returned user ID
    if (createUserResponse?.data?.data?.id && userData.role) {
      await postWithDepartment(
        "/accounts/users/department-roles",
        {
          userId: createUserResponse.data.data.id,
          role: userData.role
        },
        { params: { department } }
      );
    }

    return createUserResponse;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user role for a specific department
export const assignUserRoleApi = async (userId: number, role: string, department: string) => {
  // PATCH /accounts/users/{id}/department-roles?department=DEPT
  return patchWithDepartment(
    `/accounts/users/${userId}/department-roles`,
    { role },
    { params: { department } }
  );
};

// Update user fields (except role)
export const updateUserApi = async (userId: number, userData: any) => {
  // PATCH /accounts/users/{id}/?department=DEPT
  const department = userData.defaultDepartment || userData.department;
  const updateResponse = await patchWithDepartment(
    `/accounts/users/${userId}/`,
    {
      name: userData.name,
      mobile: userData.mobile,
      email: userData.email,
      employeeCode: userData.employeeCode,
      officeId: userData.officeId,
      status: userData.status,
      locality: userData.locality,
      defaultDepartment: userData.defaultDepartment,
    },
    { params: { department } }
  );

  // If role is being updated, call assignUserRoleApi
  if (userData.role) {
    await assignUserRoleApi(userId, userData.role, department);
  }

  return updateResponse;
};

export const getAllFieldExecutivesApi = async () => {
  return getWithDepartment("/accounts/users", {
    params: {
      role: "FieldExecutive"
    }
  });
};
