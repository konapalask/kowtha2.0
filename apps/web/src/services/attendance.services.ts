import axiosInstance from "@/config/axios.config"

export const getAttendanceRecodsApi =(filters:any)=>{
    return axiosInstance.get<any>(`/attendance`,{params:{...filters}})
}