// src/api/auth.js
import apiClient from './apiClient';

// NOTE: Your backend doesn't currently have authentication endpoints (login/register).
// You would need to add routes like POST /auth/login to your Node.js backend
// that verify credentials and return a JWT token.
// For now, this is a conceptual example for a login function.

export const loginUser = async (email, password) => {
  try {
    // This endpoint `auth/login` is an example. You'd need to implement it on backend.
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token); // Store token
    return user; // Return user data
  } catch (error) {
    console.error('Login failed:', error);
    throw error; // Propagate error for UI to handle
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  // You might want to invalidate token on backend if needed
};