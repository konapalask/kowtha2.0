import axiosInstance from "../config/axios.config";
import { getWithDepartment } from "./api.services";

interface GenerateOtpPayload {
  mobile: string;
}

interface GenerateOtpResponse {
  success: boolean;
  message: string;
}

interface VerifyOtpPayload {
  mobile: string;
  otp: string;
}

interface VerifyOtpResponse {
  [key: string]: any;
  // data: {
  //   accessToken: string;
  //   refreshToken: string;
  //   message?: string;
  // };
  // status: number;
  // statusText: string;
  // headers: {
  //   "content-length": string;
  //   "content-type": string;
  // };
  // config: any;
  // request: {
  //   url: string;
  // };
}

export const generateOtpApi = (payload: GenerateOtpPayload) => {
  return axiosInstance.post<GenerateOtpResponse>(
    "/accounts/otp/generate",
    payload
  );
};

export const verifyOtpApi = (payload: VerifyOtpPayload) => {
  return axiosInstance.post<VerifyOtpResponse>("/accounts/otp/verify", payload);
};

export const getUserDetailsApi = () => {
  return getWithDepartment("/accounts/profile");
};

export const updateUserDepartmentApi = (userId: number, department: string) => {
  if (!department || department.trim() === '') {
    throw new Error('Department parameter is required');
  }
  
  const encodedDepartment = encodeURIComponent(department.trim());
  console.log('Making API call with department:', encodedDepartment);
  
  return axiosInstance.patch(`/accounts/users/${userId}?department=${encodedDepartment}`, {
    defaultDepartment: department,
  });
};
