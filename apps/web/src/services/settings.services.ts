import axiosInstance from "@/config/axios.config";

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
  return axiosInstance.get<Organization>(`/accounts/organization`);
};

// export const updateOrganizationApi = (organization: Organization) => {
//   return axiosInstance.put<Organization>(`/org/organization`, organization);
// };

export const getOfficesApi = () => {
  return axiosInstance.get<any>(`/accounts/offices`);
};

export const updateOfficeApi = (id:number, values:any) =>{
  return axiosInstance.patch( `/accounts/offices/${id}`,values)
}

export const createOfficeApi = (values:any)=>{
  return axiosInstance.post(`/accounts/offices`,values)
}