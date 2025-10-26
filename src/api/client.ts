/**
 * HTTP client configured with Axios
 * Includes interceptors for automatic JWT handling
 */

import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: inject JWT in every request
client.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("pv_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: handle responses and errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or is invalid, clear session
    if (error.response?.status === 401) {
      sessionStorage.removeItem("pv_token");
      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
