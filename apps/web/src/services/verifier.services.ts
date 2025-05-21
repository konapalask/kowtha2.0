import axiosInstance from "@/config/axios.config";

export const getVerificationData = async (id: string) => {
  const response = await axiosInstance.get(`/loans/${id}/verification-data`);
  return response.data;
};

export const generateFinalReport = async (id: string) => {
  const response = await axiosInstance.get(`/loans/${id}/generate-final-report`, {
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
    });
  return response.data;
};

export const verifierEditApi = async(id:string, verificationType:string,payload:any)=>{
  return await axiosInstance.patch(`/loans/${id}/verification/${verificationType}`,payload)
}

export const getPresignedDownloadUrl = async(path:string)=>{
  console.log(path)
  return await axiosInstance.get(`/s3/presigned-download-url`)
}