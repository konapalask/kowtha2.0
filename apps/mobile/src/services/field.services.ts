import axiosInstance from '../config/axios';

export const getFieldData = async () => {
  return axiosInstance.get('/loans/field-executive/assigned');
};

export const getUserDetails = async () => {
  return axiosInstance.get('/accounts/profile');
};

export const submitVerification = async (data: any, id: string) => {
  return axiosInstance.patch(`/loans/${id}/verification-report`, data);
};
