import axiosInstance from "@/config/axios.config";
import { getWithDepartment, postWithDepartment, patchWithDepartment } from "./api.services";

export const getVerificationData = async (id: string) => {
  const response = await getWithDepartment(`/loans/${id}/verification-data`);
  return response.data;
};

export const generatePreviewReport = async (
  id: string,
  type: string,
  status: string | null
) => {
  const response = await getWithDepartment(
    `/loans/${id}/preview-final-report`,
    {
      params: { type, status },
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    }
  );
  return response.data;
};

export const generateFinalReport = (id: string, type: string) => {
  return getWithDepartment(`/loans/${id}/generate-final-report`, {
    params: { type }
  });
};

export const verifierEditApi = async (
  id: string,
  verificationType: string,
  payload: any
) => {
  return await patchWithDepartment(
    `/loans/${id}/verification/${verificationType}`,
    payload
  );
};

export const getPresignedDownloadUrl = async (path: string) => {
  console.log(path);
  return await getWithDepartment(`/s3/presigned-download-url`);
};

export const getEditRequestsApi = async (status: string, loanId: string) => {
  return await getWithDepartment(`/edit-requests`, {
    params: { status, loanId }
  });
};

export const getEditRequestsById = async (id: string) => {
  return await getWithDepartment(`/edit-requests/${id}`);
};

export const postEditRequestApi = async (payload: any) => {
  return await postWithDepartment(`/edit-requests`, payload);
};

export const updateEditRequestApi = async (id: string, payload: any) => {
  return await patchWithDepartment(`/edit-requests/${id}/update`, payload);
};

export const getAllEditRequestsApi = async () => {
  return await getWithDepartment(`/edit-requests`, {
    params: { status: "Pending" }
  });
};

// export const editRequestApproveApi = async (id: string, payload: any) => {
//   return await axiosInstance.patch(`/edit-requests/${id}/update`, payload);
// };

export const loanApproveRejectApi = async (id: string, payload: any) => {
  return await postWithDepartment(`/loans/${id}/verify`, payload);
};

export const patchFinalVerdict = async (
  id: string,
  type: string,
  payload: any
) => {
  return await patchWithDepartment(
    `/loans/${id}/verification/${type}/approve`,
    payload
  );
};

export const submitFinancialAnalysis = async (
  id: string,
  payload: any
) => {
  return await postWithDepartment(
    `/loans/verification/${id}/financial-analysis`,
    payload,
    { params: { department: 'PD' } }
  );
};

export const updateFinancialAnalysis = async (
  id: string,
  payload: any
) => {
  return await patchWithDepartment(
    `/loans/verification/${id}/financial-analysis`,
    payload,
    { params: { department: 'PD' } }
  );
};

export const updateSynopsis = async (
  id: string,
  synopsis: string
) => {
  return await patchWithDepartment(
    `/loans/verification/${id}/financial-analysis`,
    { synopsis },
    { params: { department: 'PD' } }
  );
};
