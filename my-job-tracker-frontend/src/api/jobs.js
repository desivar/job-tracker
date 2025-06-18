// src/api/jobs.js
import apiClient from "./apiClient";

export const createJob = async (jobData) => {
  try {
    const response = await apiClient.post("/api/jobs", jobData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobs = async (filters = {}) => {
  try {
    const response = await apiClient.get("/api/jobs", { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const response = await apiClient.get(`/api/jobs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await apiClient.put(`/api/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await apiClient.delete(`/api/jobs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const applyToJob = async (jobId, applicationData) => {
  try {
    const response = await apiClient.post(
      `/api/jobs/${jobId}/apply`,
      applicationData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
