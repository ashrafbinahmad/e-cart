"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com", // Replace with your API base URL
});

// Add an interceptor to set the authorization header
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Add an interceptor to handle unauthorized requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Send a post request to refresh tokens
          const response = await axios.post("/refresh", { refreshToken });

          // Update the access token in local storage
          localStorage.setItem("accessToken", response.data.accessToken);

          // Retry the original request with the new access token
          return api(originalRequest);
        } catch (refreshError) {
          // Handle refresh token error
          console.error("Failed to refresh tokens:", refreshError);
        }
      }

      // go to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
