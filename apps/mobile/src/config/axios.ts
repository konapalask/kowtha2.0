import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';
import RNRestart from 'react-native-restart';
import {clearAll, clearItem, getItem, setItem} from '../helpers/utility';
import {Platform} from 'react-native';

// TypeScript declarations for @env module
declare module '@env' {
  export const REACT_APP_BASE_URL: string;
}

// Use the environment variable if available, otherwise use platform-specific localhost
const getBaseURL = () => {
  if (REACT_APP_BASE_URL) {
    return REACT_APP_BASE_URL;
  }

  // For Android emulator, use 10.0.2.2 to access host machine
  // For iOS simulator, use localhost
  // For physical devices, use your actual backend URL
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api';
  } else {
    return 'http://localhost:3001/api';
  }
};

const axiosConfig = {
  baseURL: getBaseURL(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
};
const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(async config => {
  const token = await getItem('accessToken');
  const Organization = await getItem('organisation_id');
  const PatientId = await getItem('patient_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (Organization) {
    config.headers.Organization = Organization;
  }
  if (PatientId) {
    config.headers.PatientId = PatientId;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const refreshTokenApi = 'accounts/refresh-token/';
    const verifyOtpApi = 'accounts/otp/verify';
    const originalRequest = error.config;
    const errorMessage =
      error?.response?.data?.detail?.code || error?.response?.data?.code;
    const errorStatusCode = error?.response?.status;
    const tokenInvalid = 'TOKEN_EXPIRED';
    const accountNotFound = 'UNAUTHORIZED_USER';
    console.log(originalRequest.url);

    if (
      ['/accounts/otp/verify', '/accounts/otp/generate'].includes(
        originalRequest.url,
      )
    ) {
      // clearAll();
      return Promise.reject(error);
    }

    if (await getItem('testUser')) {
      return Promise.reject(error);
    }

    if (errorStatusCode === 401) {
      // clearAll();
      clearItem('accessToken');
      clearItem('refreshToken');
      RNRestart.Restart();
    }

    //Prevent infinite loops
    if (errorStatusCode === 401 && originalRequest.url === refreshTokenApi) {
      // clearAll();
      RNRestart.Restart();

      return Promise.reject(error);
    }

    //Invalid credentials or user not exist
    if (errorMessage === accountNotFound && errorStatusCode === 401) {
      // clearAll();
      RNRestart.Restart();
    }

    // Handle general 401 unauthorized errors
    if (errorStatusCode === 401) {
      // clearAll();
      RNRestart.Restart();
      return Promise.reject(error);
    }

    //triggers when user session is expired
    if (errorMessage === tokenInvalid && errorStatusCode === 401) {
      const refreshToken = await getItem('refresh_token');
      if (refreshToken) {
        if (
          refreshToken &&
          /^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$/.test(
            refreshToken,
          )
        ) {
          const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
          const now = Math.ceil(Date.now() / 1000);

          if (tokenParts.exp > now) {
            return axiosInstance
              .post(refreshTokenApi, {refresh_token: refreshToken})
              .then(async response => {
                await setItem('access_token', response.data.access_token);
                return axiosInstance(originalRequest);
              })
              .catch(err => {
                console.log(err);
                // clearAll();
                RNRestart.Restart();
              });
          } else {
            // clearAll();
            RNRestart.Restart();
          }
        } else {
          // clearAll();
          RNRestart.Restart();
        }
      } else {
        // clearAll();
        RNRestart.Restart();
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
