import apiClient from "./apiClient";

export const getProfile = async () => {
  try {
    const response = await apiClient.get("/users/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/users/profile", profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await apiClient.post("/upload/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getApplicationHistory = async () => {
  try {
    const response = await apiClient.get("/applications/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};
