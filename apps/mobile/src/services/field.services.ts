import axiosInstance from '../config/axios';

export const getFieldData = async (page: number, status: string) => {
  return axiosInstance.get(
    `/loans/field-executive/assigned?page=${page}&status=${status}`,
  );
};

export const getUserDetails = async () => {
  return axiosInstance.get('/accounts/profile');
};

export const submitVerification = async (data: any, id: string) => {
  return axiosInstance.patch(`/loans/${id}/submit-verification-report`, data);
};

export const getPresignedUrl = async (id: string) => {
  return axiosInstance.get(`/loans/${id}/presigned-url`);
};

export const getImageUploadPresignedUrl = async (
  fileName: string,
  contentType: string,
) => {
  return axiosInstance.post('/s3/presigned-upload-url', {
    path: fileName,
    contentType,
  });
};

export const uploadImageToS3 = async (
  presignedUrl: string,
  imageUri: string,
) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  return fetch(presignedUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': blob.type,
    },
  });
};

export const verificationRetryApi = async (payload: any) => {
  return axiosInstance.post(`/loans/verification-retry`, payload);
};
