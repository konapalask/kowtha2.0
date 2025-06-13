import axiosInstance from "../config/axios.config";

export interface UserFilters {
  employeeCode?: string;
  name?: string;
  role?: string;
}

export const getUsersApi = async (page?: number, limit?: number, filters?: UserFilters) => {
  return axiosInstance.get("/accounts/all-users", {
    params: {
      page,
      limit,
      ...filters
    }
  });
};

export const getFieldExecutivesByOfficeIdApi = async (officeId: string) => {
  return axiosInstance.get(
    `/accounts/users?role=FieldExecutive&officeId=${officeId}`
  );
};

export const getVerifiersApi = async () => {
  return axiosInstance.get("/accounts/users?role=Verifier");
};

export const createUserApi = async (userData: any) => {
  return axiosInstance.post("/accounts/users", userData);
};

export const updateUserApi = async (userId: number, userData: any) => {
  return axiosInstance.patch(`/accounts/users/${userId}`, userData);
};

export const getAllFieldExecutivesApi = async () => {
  return axiosInstance.get("/accounts/users?role=FieldExecutive");
};
