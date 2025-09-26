import axiosInstance from "@/config/axios.config";
import { getWithDepartment } from "./api.services";

export const getDashboardHealthCheck = async () => {
  const response = await getWithDepartment("/dashboard/health-check");
  return response.data;
};

export const getDashboardMetrics = async (params?: { fromDate: string | null; toDate: string | null }) => {
  const response = await getWithDepartment("/dashboard/metrics", { params });
  return response.data.data;
};