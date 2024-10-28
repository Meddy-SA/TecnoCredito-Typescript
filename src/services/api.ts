// api.ts file

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a cada solicitud.
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Error de autenticación");
          // FIX: Aquí podrías redirigir al login o refrescar el token
          break;
        case 403:
          console.log("Error de CORS");
          break;
        default:
          console.log("Error en la solicitud:", error.message);
      }
    } else if (error.request) {
      console.log("No se recibió respuesta:", error.request);
    } else {
      console.log("Error al configurar la solicitud:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
