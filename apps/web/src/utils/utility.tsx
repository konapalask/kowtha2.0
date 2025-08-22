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

// Get office ID for a specific department
export const getOfficeIdByDepartment = (department: string): number | null => {
  if (typeof window === "undefined") return null;
  
  const userDetails = getUserDetails();
  if (!userDetails?.departmentRoles) return null;
  
  const deptRole = userDetails.departmentRoles.find(
    (role: any) => role.department === department
  );
  
  return deptRole?.officeId || null;
};

// Get current department's office ID
export const getCurrentDepartmentOfficeId = (): number | null => {
  const currentDept = getCurrentDepartment();
  if (!currentDept) return null;
  
  return getOfficeIdByDepartment(currentDept);
};

// Get current department's role
export const getCurrentDepartmentRole = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const userDetails = getUserDetails();
  const currentDept = getCurrentDepartment();
  
  if (!userDetails?.departmentRoles || !currentDept) return null;
  
  const deptRole = userDetails.departmentRoles.find(
    (role: any) => role.department === currentDept
  );
  
  return deptRole?.role || null;
};

// Get role for a specific department
export const getRoleByDepartment = (department: string): string | null => {
  if (typeof window === "undefined") return null;
  
  const userDetails = getUserDetails();
  if (!userDetails?.departmentRoles) return null;
  
  const deptRole = userDetails.departmentRoles.find(
    (role: any) => role.department === department
  );
  
  return deptRole?.role || null;
};

// Get role from default department
export const getDefaultDepartmentRole = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const userDetails = getUserDetails();
  if (!userDetails?.defaultDepartment) return null;
  
  return getRoleByDepartment(userDetails.defaultDepartment);
};

let userDetailsUpdateCallbacks: (() => void)[] = [];
let userDetailsUpdateCounter = 0;

export const notifyUserDetailsChange = () => {
  if (typeof window !== "undefined") {
    userDetailsUpdateCounter++;
    
    window.dispatchEvent(new CustomEvent('userDetailsChanged'));
    
    // Also trigger a storage event as a fallback
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userDetails',
      newValue: JSON.stringify(getUserDetails()),
      oldValue: null,
      storageArea: localStorage
    }));
    
    // Call all registered callbacks
    userDetailsUpdateCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in user details update callback:', error);
      }
    });
  }
};

export const subscribeToUserDetailsChanges = (callback: () => void) => {
  if (typeof window !== "undefined") {
    userDetailsUpdateCallbacks.push(callback);
    
    // Listen for custom event
    window.addEventListener('userDetailsChanged', callback);
    
    // Also listen for storage events as a fallback
    window.addEventListener('storage', (e) => {
      if (e.key === 'userDetails') {
        callback();
      }
    });
    
    return () => {
      // Remove callback from global list
      userDetailsUpdateCallbacks = userDetailsUpdateCallbacks.filter(cb => cb !== callback);
      window.removeEventListener('userDetailsChanged', callback);
    };
  }
  return () => {};
};

// Get the current update counter
export const getUserDetailsUpdateCounter = () => userDetailsUpdateCounter;