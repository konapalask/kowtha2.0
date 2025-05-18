import axiosInstance from "@/config/axios.config";

export const getDashboardHealthCheck = async () => {
  const response = await axiosInstance.get("/dashboard/health-check");
  return response.data;
};

export const getDashboardMetrics = async () => {
  const response = await axiosInstance.get("/dashboard/metrics");
  return response.data.data;
};