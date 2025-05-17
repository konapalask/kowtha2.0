import axiosInstance from "../config/axios.config";

export const getUsersApi = async () => {
    return axiosInstance.get("/accounts/users");
}

export const getFieldExecutivesByOfficeIdApi = async (officeId: string) => {
    return axiosInstance.get(`/accounts/users?role=FieldExecutive&officeId=${officeId}`);
}