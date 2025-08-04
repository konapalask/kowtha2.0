import axiosInstance from "@/config/axios.config";
import { USER_DETAILS } from "@/constants/defaultKeys";
import { getPresignedDownloadUrl } from "@/services/verifier.services";

export const getS3ImageUrl = async (s3ImageUrl: string): Promise<any> => {
  // Remove any leading slashes from the s3ImageUrl
  try {
    const response = await axiosInstance.get(
      `/s3/presigned-download-url?path=${s3ImageUrl}`
    );
    // if (!response.data.ok) {
    //   throw new Error(response.data.message || 'Failed to get presigned URL');
    // }
    // console.log(response.data)
    return response.data.url;
  } catch (error) {
    console.error("Error getting S3 image URL:", error);
    return null;
  }
};

export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;

  if (typeof obj !== "object") {
    if (typeof obj === "string") return obj.trim().length === 0;
    return false;
  }

  if (Array.isArray(obj)) {
    return obj.every(isEmpty);
  }

  const keys = Object.keys(obj);
  if (keys.length === 0) return true;

  return keys.every((key) => isEmpty(obj[key]));
};

export const getUserDetails = () => {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem(USER_DETAILS) || "{}");
};

export const setUserDetails = (userDetails: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_DETAILS, JSON.stringify(userDetails));
};

// Current Department Management
export const getCurrentDepartment = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem('currentDepartment') || "";
};

export const setCurrentDepartment = (department: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem('currentDepartment', department);
};

export const initializeCurrentDepartment = () => {
  if (typeof window === "undefined") return "";
  
  const storedCurrentDept = getCurrentDepartment();
  if (storedCurrentDept) {
    return storedCurrentDept;
  }
  
  // If no current department is stored, use default department
  const userDetails = getUserDetails();
  if (userDetails?.defaultDepartment) {
    setCurrentDepartment(userDetails.defaultDepartment);
    return userDetails.defaultDepartment;
  }
  
  return "";
};
