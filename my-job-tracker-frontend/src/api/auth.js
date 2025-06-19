import apiClient from "./apiClient";

// Dummy login function (no backend call, no token)
export const loginUser = async (email, password) => {
  // Optionally, you can skip the API call and just "log in" any user
  const userData = { email }; // or any dummy user object
  localStorage.setItem("user", JSON.stringify(userData));
  // No token is set
  return userData;
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
  // Always return true, or just check for user
  const user = getCurrentUser();
  return !!user;
};