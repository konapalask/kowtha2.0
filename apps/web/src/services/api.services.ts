import axiosInstance from "../config/axios.config";
import { getCurrentDepartment } from "@/utils/utility";

// Generic API call wrapper that automatically adds current department parameter
export const apiCallWithDepartment = (
  method: 'get' | 'post' | 'patch' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: any
) => {
  const currentDepartment = getCurrentDepartment();
  
  // Add current department as query parameter if it exists
  const finalConfig = {
    ...config,
    params: {
      ...(config?.params || {}),
      ...(currentDepartment ? { department: currentDepartment } : {})
    }
  };

  console.log(`Making ${method.toUpperCase()} request to ${url} with department: ${currentDepartment}`);

  switch (method) {
    case 'get':
      return axiosInstance.get(url, finalConfig);
    case 'post':
      return axiosInstance.post(url, data, finalConfig);
    case 'patch':
      return axiosInstance.patch(url, data, finalConfig);
    case 'put':
      return axiosInstance.put(url, data, finalConfig);
    case 'delete':
      return axiosInstance.delete(url, finalConfig);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

// Convenience methods
export const getWithDepartment = (url: string, config?: any) => 
  apiCallWithDepartment('get', url, undefined, config);

export const postWithDepartment = (url: string, data?: any, config?: any) => 
  apiCallWithDepartment('post', url, data, config);

export const patchWithDepartment = (url: string, data?: any, config?: any) => 
  apiCallWithDepartment('patch', url, data, config);

export const putWithDepartment = (url: string, data?: any, config?: any) => 
  apiCallWithDepartment('put', url, data, config);

export const deleteWithDepartment = (url: string, config?: any) => 
  apiCallWithDepartment('delete', url, undefined, config);