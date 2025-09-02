import axiosInstance from "@/config/axios.config";
import { getWithDepartment, postWithDepartment, patchWithDepartment } from "./api.services";

export interface Organization {
  id: number;
  name: string;
  description: string;
}

export interface Office {
  [key: string]: any;
  //  data: {
  //   id: number;
  //   name: string;
  //   townCity: string;
  //   address: string;
  //   employees?: number;
  //  }
}

export interface Bank {
  id: number;
  name: string;
  logo: string | null;
  parent: string;
  createdAt: string;
  updatedAt: string;
}

export const getOrganizationApi = () => {
  return getWithDepartment(`/accounts/organization`);
};

// export const updateOrganizationApi = (organization: Organization) => {
//   return axiosInstance.put<Organization>(`/org/organization`, organization);
// };

export const getOfficesApi = () => {
  return getWithDepartment(`/accounts/offices`);
};

export const getBanksApi = () => {
  return getWithDepartment(`/dashboard/banks`);
};

export const createBankApi = (values: { name: string; logo?: string | null; parent?: string | null; }) => {
  return postWithDepartment(`/dashboard/banks`, values);
};

export const updateBankApi = (id: number, values: { name: string; logo?: string | null; parent?: string | null; }) => {
  return patchWithDepartment(`/dashboard/banks/${id}`, values);
};

export const deleteBankApi = (id: number) => {
  return axiosInstance.delete(`/dashboard/banks/${id}?department=FI`);
};

export const getOfficesByDepartmentApi = (department: string) => {
  return axiosInstance.get(`/accounts/offices`, { params: { department } });
};

export const updateOfficeApi = (id:number, values:any) =>{
  return patchWithDepartment(`/accounts/offices/${id}`, values);
}

export const createOfficeApi = (values:any)=>{
  return postWithDepartment(`/accounts/offices`, values);
}