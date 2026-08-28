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
}

export interface LoginWithPasswordPayload {
  username: string;
  password: string;
  deviceId?: string;
  isMobile?: boolean;
}

export interface LoginWithPasswordResponse {
  accessToken: string;
  refreshToken: string;
  isPasswordChanged: boolean;
  message?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
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

export const loginWithPasswordApi = (payload: LoginWithPasswordPayload) => {
  return axiosInstance.post<LoginWithPasswordResponse>("/accounts/login", payload);
};

export const changePasswordApi = (payload: ChangePasswordPayload) => {
  return axiosInstance.post<ChangePasswordResponse>("/accounts/change-password", payload);
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
