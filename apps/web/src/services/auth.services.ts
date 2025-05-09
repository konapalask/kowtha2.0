import axiosInstance from "../config/axios.config";

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
  data: {
    token: string;
    refreshToken?: string;
    message?: string;
  };
  status: number;
  statusText: string;
  headers: {
    "content-length": string;
    "content-type": string;
  };
  config: any;
  request: {
    url: string;
  };
}

export const generateOtpApi = (payload: GenerateOtpPayload) => {
  return axiosInstance.post<GenerateOtpResponse>("/accounts/otp/generate", payload);
};

export const verifyOtpApi = (payload: VerifyOtpPayload) => {
  return axiosInstance.post<VerifyOtpResponse>("/accounts/otp/verify", payload);
}; 