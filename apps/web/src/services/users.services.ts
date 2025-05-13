import axiosInstance from "../config/axios.config";

export const getUsersApi = async () => {
    return axiosInstance.get("/accounts/users");
}

