import apiClient from "./apiClient";

export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/api/dashboard/stats");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardActivities = async () => {
  try {
    const response = await apiClient.get("/api/dashboard/activities");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobStats = async () => {
  try {
    const response = await apiClient.get("/api/dashboard/job-stats");
    return response.data;
  } catch (error) {
    throw error;
  }
};
