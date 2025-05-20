import axios from "axios";
import {
  clear,
  clearAllCookies,
  extractDomainFromUrl,
  getCookie,
  setCookie,
  setItem,
} from "../helpers/localStorage";
import {
  ACCESS_TOKEN,
  ACTIVEDOMAIN,
  REFRESH_TOKEN,
} from "../constants/defaultKeys";
// import { getTokenIfNotExpired } from "../helpers/utility";
// import { redirectToDashboard } from "../components/Auth/helper";
import customToast from "../blocks/CustomToast";

const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use((config) => {
  const token = getCookie(ACCESS_TOKEN);
  const Organization = getCookie("organisation_id");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (Organization) {
    config.headers.Organization = Organization;
  }
  return config;
});

const handleLogout = () => {
  clear();
  clearAllCookies();
  // Use window.location.replace instead of href for more reliable navigation
  window.location.replace(`${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/logout`);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshTokenApi = "/account/refresh-token";
    const originalRequest = error?.config;
    const errorMessage =
      error?.response?.data?.detail?.code || error?.response?.data?.code;
    const errorStatusCode = error?.response?.status;
    console.log(errorStatusCode, "err-status-code");
    const tokenInvalid = "TOKEN_EXPIRED";
    const accountNotFound = "UNAUTHORIZED_USER";

    // Handle 401 errors
    if (errorStatusCode === 401) {
      handleLogout(); //temporary logout
      // If it's a refresh token request that failed, logout immediately
      if (originalRequest.url === refreshTokenApi) {
        handleLogout();
        return Promise.reject(error);
      }

      // Handle unauthorized user
      if (errorMessage === accountNotFound) {
        handleLogout();
        return Promise.reject(error);
      }

      // Handle token expiration
      if (errorMessage === tokenInvalid) {
        const refreshToken = getCookie(REFRESH_TOKEN);
        
        if (!refreshToken) {
          handleLogout();
          customToast({
            type: "error",
            message: "Your session has been expired, please login again",
          });
          return Promise.reject(error);
        }

        const regex = new RegExp(
          "^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$"
        );

        if (!regex.test(refreshToken)) {
          handleLogout();
          return Promise.reject(error);
        }

        try {
          const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
          const now = Math.ceil(Date.now() / 1000);

          if (tokenParts.exp <= now) {
            handleLogout();
            customToast({
              type: "error",
              message: "Your session has been expired, please login again",
            });
            return Promise.reject(error);
          }

          const response = await axiosInstance.post(refreshTokenApi, { refresh_token: refreshToken });
          setCookie(
            ACCESS_TOKEN,
            response.data.access_token,
            `.${process.env.NEXT_PUBLIC_DOMAIN}`,
            "/"
          );
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          handleLogout();
          customToast({
            type: "error",
            message: "Your session has been expired, please login again",
          });
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
