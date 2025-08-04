import axiosInstance from "@/config/axios.config"
import { getWithDepartment } from "./api.services";

export const getAttendanceRecodsApi =(filters:any)=>{
    return getWithDepartment(`/attendance`, {params:{...filters}});
}