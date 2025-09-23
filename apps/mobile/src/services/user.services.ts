import axiosInstance from '../config/axios';

export const getUserDetailsApi = () => {
  return axiosInstance.get(`/accounts/profile`);
};

export const postAttendanceApi = (paylaod: any, dept: string) => {
  return axiosInstance.post(`/attendance?department=${dept}`, paylaod);
};
