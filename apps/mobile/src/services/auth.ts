import axiosInstance from '../config/axios';
import Toast from 'react-native-toast-message';

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
      isMobile: true,
    });

    return response?.data;
  } catch (error: any) {
    console.error('Error generating OTP:', error);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      const messageText = Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message;

      switch (status) {
        case 400:
          Toast.show({
            type: 'error',
            text1: messageText || 'Bad request. Please check the input.',
          });
          break;
        case 403:
          Toast.show({
            type: 'error',
            text1: messageText || 'Access denied.',
          });
          break;
        case 404:
          Toast.show({
            type: 'error',
            text1: messageText || 'Mobile number not found.',
          });
          break;
        default:
          Toast.show({
            type: 'error',
            text1: messageText || 'Something went wrong. Please try again.',
          });
      }
    } else {
      // Network or unknown error
      Toast.show({
        type: 'error',
        text1: 'Network error. Please check your connection.',
      });
    }

    throw error; // rethrow if the caller needs to do something with it
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

    // Normalize token keys from backend into camelCase expected by app
    const data = response?.data || {};
    const accessToken =
      data.accessToken ?? data.access_token ?? data.token ?? undefined;
    const refreshToken =
      data.refreshToken ?? data.refresh_token ?? data.token ?? undefined;

    if (!accessToken || !refreshToken) {
      console.warn('verifyOTP: Missing tokens in response', data);
    }

    return {accessToken, refreshToken};
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
