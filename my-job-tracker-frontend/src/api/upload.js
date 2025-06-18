import apiClient from "./apiClient";

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await apiClient.post("/api/upload/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUploadedFile = async (filename) => {
  try {
    const response = await apiClient.get(`/api/upload/${filename}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
