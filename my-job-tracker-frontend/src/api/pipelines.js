// src/api/pipelines.js
import apiClient from "./apiClient";

export const getPipelines = async () => {
  try {
    const response = await apiClient.get("/api/pipelines");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPipelineById = async (id) => {
  try {
    const response = await apiClient.get(`/api/pipelines/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPipeline = async (pipelineData) => {
  try {
    const response = await apiClient.post("/api/pipelines", pipelineData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePipeline = async (id, pipelineData) => {
  try {
    const response = await apiClient.put(`/api/pipelines/${id}`, pipelineData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePipeline = async (id) => {
  try {
    const response = await apiClient.delete(`/api/pipelines/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePipelineStage = async (pipelineId, jobId, newStage) => {
  try {
    const response = await apiClient.put(
      `/api/pipelines/${pipelineId}/jobs/${jobId}`,
      {
        stage: newStage,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
