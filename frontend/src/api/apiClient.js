// src/api/apiClient.js
import axios from 'axios';

// Get backend URL from environment variables
// IMPORTANT: In a real app, this should be set in .env.development and .env.production
// e.g., REACT_APP_BACKEND_URL=http://localhost:5000
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an interceptor to include auth token in every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store a token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;