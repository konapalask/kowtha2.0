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
  return postWithDepartment("/accounts/users", userData);
};

export const updateUserApi = async (userId: number, userData: any) => {
  return patchWithDepartment(`/accounts/users/${userId}`, userData);
};

export const getAllFieldExecutivesApi = async () => {
  return getWithDepartment("/accounts/users", {
    params: {
      role: "FieldExecutive"
    }
  });
};
