import axios from 'axios';
// import {REACT_APP_BASE_URL} from '@env';
import RNRestart from 'react-native-restart';
import {clearAll, clearItem, getItem, setItem} from '../helpers/utility';
console;
const axiosConfig = {
  // baseURL: REACT_APP_BASE_URL,
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(async config => {
  const token = await getItem('access_token');
  const Organization = await getItem('organisation_id');
  const PatientId = await getItem('patient_id');

  if (token) {
    config.headers.PatientAuthorization = `Bearer ${token}`;
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
    const originalRequest = error.config;
    const errorMessage =
      error?.response?.data?.detail?.code || error?.response?.data?.code;
    const errorStatusCode = error?.response?.status;
    const tokenInvalid = 'token_not_valid';
    const accountNotFound = 'UNAUTHORIZED_USER';

    if ('auth/'.includes(originalRequest.url)) {
      clearAll();
      return Promise.reject(error);
    }

    //Prevent infinite loops
    if (errorStatusCode === 401 && originalRequest.url === refreshTokenApi) {
      clearAll();
      RNRestart.Restart();
      return Promise.reject(error);
    }

    //Invalid credentials or user not exist
    if (errorMessage === accountNotFound && errorStatusCode === 401) {
      clearAll();
      RNRestart.Restart();
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
          return axiosInstance
            .post(refreshTokenApi, {refresh_token: refreshToken})
            .then(async response => {
              await setItem('access_token', response.data.access_token);
              return axiosInstance(originalRequest);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          clearAll();
          RNRestart.Restart();
        }
      } else {
        clearAll();
        RNRestart.Restart();
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
