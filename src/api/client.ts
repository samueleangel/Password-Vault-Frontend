/**
 * Cliente HTTP configurado con Axios
 * Incluye interceptores para JWT automático
 */

import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: inyectar JWT en cada request
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

// Interceptor: manejo de respuestas y errores
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido, limpiar sesión
    if (error.response?.status === 401) {
      sessionStorage.removeItem("pv_token");
      // Redirigir a login si no estamos ya ahí
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;

