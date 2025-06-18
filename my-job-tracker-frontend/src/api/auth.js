// src/api/auth.js
import apiClient from "./apiClient";

// NOTE: Your backend doesn't currently have authentication endpoints (login/register).
// You would need to add routes like POST /auth/login to your Node.js backend
// that verify credentials and return a JWT token.
// For now, this is a conceptual example for a login function.

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      email,
      password,
    });

    // The backend returns { success: true, data: { user, token } }
    const { success, data } = response.data;

    if (!success || !data || !data.token) {
      throw new Error("Invalid response format from server");
    }

    // Store token in localStorage
    localStorage.setItem("token", data.token);

    // Store user data
    const userData = data.user;
    localStorage.setItem("user", JSON.stringify(userData));

    // Configure axios defaults
    apiClient.defaults.headers["Authorization"] = `Bearer ${data.token}`;

    return userData;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete apiClient.defaults.headers["Authorization"];
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();
  return !!(token && user);
};
