// src/api/users.js
import apiClient from './apiClient';

export const getAllUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

// Add this new function to your existing src/api/users.js file
export const getCurrentUserProfile = async (token) => {
  // Assuming apiClient can handle headers or you pass them directly
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Send the JWT token in the Authorization header
    },
  };
  const response = await apiClient.get('/users/me', config);
  return response.data;
};