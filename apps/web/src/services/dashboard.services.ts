import axiosInstance from "@/config/axios.config";

export const getDashboardHealthCheck = async () => {
  const response = await axiosInstance.get("/dashboard/health-check");
  return response.data;
};

export const getDashboardMetrics = async (params?: { startDate: string | null; endDate: string | null }) => {
  const response = await axiosInstance.get("/dashboard/metrics", { params });
  return response.data.data;
};