import axios from "axios";
import {
  clear,
  clearAllCookies,
  extractDomainFromUrl,
  getCookie,
  setCookie,
} from "../helpers/localStorage";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "../constants/defaultKeys";
import customToast from "../blocks/CustomToast";
import { API_BASE_URL, DOMAIN_BASE_URL, DOMAIN } from "./env";

const axiosConfig = {
  baseURL: API_BASE_URL,
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
  window.location.replace(`/login`);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshTokenApi = "/accounts/refresh-token";
    const originalRequest = error?.config;

    const errorMessage =
      error?.response?.data?.message || error?.response?.data?.message;

    const errorStatusCode = error?.response?.status;
    const tokenInvalid = "Unauthorized";
    const accountNotFound = "UNAUTHORIZED_USER";

    console.log(error);

    // Prevent infinite loops
    if (errorStatusCode === 401 && originalRequest?.url?.includes(refreshTokenApi)) {
      handleLogout();
      return Promise.reject(error);
    }

    // Invalid credentials or user not exist
    if (errorMessage === accountNotFound && errorStatusCode === 401) {
      handleLogout();
      return Promise.reject(error);
    }

    // Triggers when user session is expired
    if (errorMessage === tokenInvalid && errorStatusCode === 401) {
      const refreshToken = getCookie(REFRESH_TOKEN);
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      if (refreshToken) {
        const regex = new RegExp(
          "^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$"
        );

        if (regex.test(refreshToken)) {
          try {
            const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
            const now = Math.ceil(Date.now() / 1000);

            // Triggers if refresh token is not expired
            if (tokenParts.exp > now) {
              const response = await axios.post(
                `${API_BASE_URL}${refreshTokenApi.replace(/^\//, '')}`,
                { refresh_token: refreshToken }
              );

              setCookie(
                ACCESS_TOKEN,
                response?.data?.accessToken,
                `.${DOMAIN}`,
                "/"
              );

              return axiosInstance(originalRequest);
            } else {
              handleLogout();
              customToast({
                type: "error",
                message: "Your session has expired, please login again",
              });
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            handleLogout();
            return Promise.reject(refreshError);
          }
        } else {
          handleLogout();
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
