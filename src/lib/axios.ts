"use client";
import axios from "axios";

let repeated = false;

const api = axios.create({
  baseURL: process.env.API_HOST, // Replace with your API base URL
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
      repeated = true

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-tokens`, { refresh_token: refreshToken });
          console.log({tokens: response.data})
          localStorage.setItem("accessToken", response.data.access_token);
          localStorage.setItem("accessToken", response.data.access_token);
          // set the authorization header and retry the original request
          api.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
        }
      }
      if(!repeated) { 
        
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);



export default api;
