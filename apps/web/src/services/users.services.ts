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
    const createUserResponse = await postWithDepartment("/accounts/users", {
      name: userData.name,
      mobile: userData.mobile,
      email: userData.email,
      employeeCode: userData.employeeCode,
      officeId: userData.officeId,
      status: userData.status || "Active",
      locality: userData.locality
    });

    // Step 2: Assign role to the created user using the returned user ID
    if (createUserResponse?.data?.data?.id && userData.role) {
      await assignUserRoleApi(createUserResponse.data.data.id, userData.role);
    }

    return createUserResponse;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const assignUserRoleApi = async (userId: number, role: string) => {
  return postWithDepartment("/accounts/users/department-roles", {
    userId: userId,
    role: role
  });
};

export const updateUserApi = async (userId: number, userData: any) => {
  // Update user basic information (without role)
  const updateResponse = await patchWithDepartment(`/accounts/users/${userId}`, {
    name: userData.name,
    mobile: userData.mobile,
    email: userData.email,
    employeeCode: userData.employeeCode,
    officeId: userData.officeId,
    status: userData.status,
    locality: userData.locality
  });

  // If role is being updated, assign the new role
  if (userData.role) {
    await assignUserRoleApi(userId, userData.role);
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
