// src/api/apiClient.js
import axios from "axios";

// Set backend URL to port 5003
const API_BASE_URL = "http://localhost:5003";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add a request interceptor to include auth token in every request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    }

    // Handle unauthorized errors
    if (error.response.status === 401) {
      // If the error is due to token expiration and we haven't tried to refresh
      if (
        error.response.data.error === "Token expired" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          // Clear existing token
          localStorage.removeItem("token");

          // Redirect to login
          window.location.href = "/login";
          return Promise.reject(error);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          return Promise.reject(refreshError);
        }
      }

      // For other 401 errors, clear auth and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Handle forbidden errors
    if (error.response.status === 403) {
      console.error("Permission denied:", error.response.data);
      // You might want to redirect to an error page or show a notification
    }

    // Handle validation errors
    if (error.response.status === 400) {
      console.error("Validation error:", error.response.data);
      return Promise.reject(error.response.data);
    }

    // Handle server errors
    if (error.response.status >= 500) {
      console.error("Server error:", error.response.data);
      return Promise.reject(
        new Error("Internal server error - please try again later")
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
