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
  window.location.replace(`${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/logout`);
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

    console.log(error)

    // Prevent infinite loops
    if (errorStatusCode === 401 && originalRequest.url === refreshTokenApi) {
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
      if(!refreshToken){
        console.log("whooo")
        handleLogout()
      }
      const mainDomainUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL;
      const mainDomain = mainDomainUrl
        ? extractDomainFromUrl(mainDomainUrl)
        : "";

      if (refreshToken) {
        const regex = new RegExp(
          "^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$"
        );

        if (regex.test(refreshToken)) {
          const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
          const now = Math.ceil(Date.now() / 1000);

          // Triggers if refresh token is not expired
          if (tokenParts.exp > now) {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${refreshTokenApi}`,
                { refresh_token: refreshToken }
              );

              setCookie(
                ACCESS_TOKEN,
                response?.data?.accessToken,
                `.${process.env.NEXT_PUBLIC_DOMAIN}`,
                "/"
              );

              return axiosInstance(originalRequest);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              handleLogout();
              return Promise.reject(refreshError);
            }
          } else {
            handleLogout();
            customToast({
              type: "error",
              message: "Your session has been expired, please login again",
            });
            return Promise.reject(error);
          }
        } else {
          handleLogout();
          return Promise.reject(error);
        }
      } else {
        handleLogout();
        customToast({
          type: "error",
          message: "Your session has been expired, please login again",
        });
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
