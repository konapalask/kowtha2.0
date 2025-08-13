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

export const getOrganizationApi = () => {
  return getWithDepartment(`/accounts/organization`);
};

// export const updateOrganizationApi = (organization: Organization) => {
//   return axiosInstance.put<Organization>(`/org/organization`, organization);
// };

export const getOfficesApi = () => {
  return getWithDepartment(`/accounts/offices`);
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