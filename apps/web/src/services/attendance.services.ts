import axiosInstance from "@/config/axios.config"
import { getWithDepartment } from "./api.services";
import { getCurrentDepartment } from "@/utils/utility";

export const getAttendanceRecodsApi = (filters: any) => {
    const department = getCurrentDepartment();
    return getWithDepartment(`/attendance`, { params: { ...filters, department } });
}