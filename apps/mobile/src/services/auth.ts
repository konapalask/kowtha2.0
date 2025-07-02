import axiosInstance from '../config/axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface OTPResponse {
  accessToken: string;
  refreshToken: string;
}

export const generateOTP = async (mobileNumber: string): Promise<void> => {
  try {
    const response = await axiosInstance.post('/accounts/otp/generate', {
      mobile: mobileNumber,
    });
    return response?.data;

    // if (response.status !== 200) {
    //   console.log('RESPONSE', response);
    //   throw new Error('Failed to generate OTP');
    // }
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (
  mobileNumber: string,
  otp: string,
  deviceId?: string,
): Promise<OTPResponse> => {
  try {
    const response = await axiosInstance.post('/accounts/otp/verify', {
      mobile: mobileNumber,
      otp,
      deviceId: deviceId || null,
    });

    // if (response.status !== 200) {
    //   throw new Error('Failed to verify OTP');
    // }
    return response?.data;

    // return {
    //   access_token: response.data.token,
    //   refresh_token: response.data.token,
    //   // access_token: response.data.access_token,
    //   // refresh_token: response.data.refresh_token,
    // };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const getPlaystoreVersion = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/app-deployments');
    return response?.data;
  } catch (error) {
    console.error('Error getting playstore version:', error);
    return null;
  }
};
