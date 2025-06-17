// src/api/pipelines.js
import apiClient from './apiClient';

export const getAllPipelines = async () => {
  const response = await apiClient.get('/pipelines');
  return response.data;
};

export const getPipelineById = async (id) => {
  const response = await apiClient.get(`/pipelines/${id}`);
  return response.data;
};

export const createPipeline = async (pipelineData) => {
  const response = await apiClient.post('/pipelines', pipelineData);
  return response.data;
};

export const updatePipeline = async (id, pipelineData) => {
  const response = await apiClient.put(`/pipelines/${id}`, pipelineData);
  return response.data;
};

export const deletePipeline = async (id) => {
  const response = await apiClient.delete(`/pipelines/${id}`);
  return response.data;
};