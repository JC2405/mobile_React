import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL_BASE = "http://10.112.71.144:8000/api";

const api = axios.create({
  baseURL: URL_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const rutasPublicas = ["/login", "/register"];

api.interceptors.request.use(
  async (config) => {
    const esRutaPublica = rutasPublicas.some((ruta) =>
      config.url.includes(ruta)
    );

    let token = null;
    if (!esRutaPublica) {
      token = await AsyncStorage.getItem("userToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRutaPublica = rutasPublicas.some((ruta) =>
      originalRequest.url.includes(ruta)
    );

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isRutaPublica
    ) {
      originalRequest._retry = true;
      await AsyncStorage.removeItem("userToken");
      console.log("Token inválido o expirado. Inicie sesión de nuevo.");
    }
    return Promise.reject(error);
  }
);

export default api;
