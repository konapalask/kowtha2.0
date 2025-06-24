import axiosInstance from "@/config/axios.config";

export const getVerificationData = async (id: string) => {
  const response = await axiosInstance.get(`/loans/${id}/verification-data`);
  return response.data;
};

export const generatePreviewReport = async (
  id: string,
  type: string,
  status: string | null
) => {
  const response = await axiosInstance.get(
    `/loans/${id}/preview-final-report?type=${type}&status=${status}`,
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    }
  );
  return response.data;
};

export const verifierEditApi = async (
  id: string,
  verificationType: string,
  payload: any
) => {
  return await axiosInstance.patch(
    `/loans/${id}/verification/${verificationType}`,
    payload
  );
};

export const getPresignedDownloadUrl = async (path: string) => {
  console.log(path);
  return await axiosInstance.get(`/s3/presigned-download-url`);
};

export const getEditRequestsApi = async (status: string, loanId: string) => {
  return await axiosInstance.get(
    `/edit-requests?status=${status}&loanId=${loanId}`
  );
};

export const getEditRequestsById = async (id: string) => {
  return await axiosInstance.get(`/edit-requests/${id}`);
};

export const postEditRequestApi = async (payload: any) => {
  return await axiosInstance.post(`/edit-requests`, payload);
};

export const updateEditRequestApi = async (id: string, payload: any) => {
  return await axiosInstance.patch(`/edit-requests/${id}/update`, payload);
};

export const getAllEditRequestsApi = async () => {
  return await axiosInstance.get(`/edit-requests?status=Pending`);
};

// export const editRequestApproveApi = async (id: string, payload: any) => {
//   return await axiosInstance.patch(`/edit-requests/${id}/update`, payload);
// };

export const loanApproveRejectApi = async (id: string, payload: any) => {
  return await axiosInstance.post(`/loans/${id}/verify`, payload);
};

export const patchFinalVerdict = async (
  id: string,
  type: string,
  payload: any
) => {
  return await axiosInstance.patch(
    `/loans/${id}/verification/${type}/approve`,
    payload
  );
};
