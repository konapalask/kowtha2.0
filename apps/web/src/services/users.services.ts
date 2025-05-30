import axiosInstance from "../config/axios.config";

export const getUsersApi = async () => {
  return axiosInstance.get("/accounts/users");
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
