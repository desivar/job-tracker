// src/api/auth.js
import apiClient from './apiClient';

export const loginUser = async (email, password) => {
  try {
    // Change this endpoint to match where your backend login will be
    const response = await apiClient.post('/users/login', { email, password }); // <-- Changed to /users/login
    const { token, user } = response.data;
    localStorage.setItem('token', token); // Store token
    localStorage.setItem('user', JSON.stringify(user)); // Good practice to store user data too
    return user; // Return user data
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || error.message; // Propagate a cleaner error message
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user'); // Clear user data on logout
  // You might want to invalidate token on backend if needed, but not common for JWT
};