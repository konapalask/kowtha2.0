import axiosInstance from "@/config/axios.config";
import { getPresignedDownloadUrl } from "@/services/verifier.services";

export const getS3ImageUrl = async (s3ImageUrl: string): Promise<any> => {
  // Remove any leading slashes from the s3ImageUrl
  try {
    const response = await axiosInstance.get(
      `/s3/presigned-download-url?path=${s3ImageUrl}`
    );
    // if (!response.data.ok) {
    //   throw new Error(response.data.message || 'Failed to get presigned URL');
    // }
    // console.log(response.data)
    return response.data.url;
  } catch (error) {
    console.error("Error getting S3 image URL:", error);
    return null;
  }
};

export const isEmpty = (obj: any) => {
  if (!obj || typeof obj !== "object") return false;

  const keys = Object.keys(obj);
  return (
    keys.length > 0 &&
    keys.some((key) => {
      const value = obj[key];

      if (value === null || value === undefined) return false;

      if (Array.isArray(value)) return value.length > 0;

      if (typeof value === "object") return Object.keys(value).length > 0;

      // if (typeof value === "string") return value.trim().length > 0;

      return true;
    })
  );
};
