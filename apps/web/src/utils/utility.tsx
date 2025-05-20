import axiosInstance from "@/config/axios.config";
import { getPresignedDownloadUrl } from "@/services/verifier.services";

export const getS3ImageUrl = async (s3ImageUrl: string): Promise<any> => {
  // Remove any leading slashes from the s3ImageUrl
  try {
    const response = await axiosInstance.get(`/s3/presigned-download-url/${s3ImageUrl}`);
    if (!response.data.ok) {
      throw new Error(response.data.message || 'Failed to get presigned URL');
    }
    console.log(response.data)
    return response.data.url;
  } catch (error) {
    console.error('Error getting S3 image URL:', error);
    return null;
  }
};
