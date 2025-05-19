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