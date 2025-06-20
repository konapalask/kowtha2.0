import axiosInstance from '../config/axios';

export const getUserDetailsApi = () => {
  return axiosInstance.get(`/accounts/profile`);
};

export const postAttendanceApi = (paylaod: any) => {
  return axiosInstance.post(`/attendance`, paylaod);
};
