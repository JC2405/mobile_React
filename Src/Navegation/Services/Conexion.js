import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚙️ CONFIGURACIÓN DE IP PARA MÓVIL
// ===========================================
// Tu IP actual es: 172.20.10.3 (obtenida con ipconfig)

// Opciones según tu entorno de desarrollo:
// ===========================================
// 📱 Para EMULADOR ANDROID: http://10.0.2.2:8000/api
// 📱 Para DISPOSITIVO FÍSICO: http://172.20.10.3:8000/api
// 🏠 Para REDES DOMÉSTICAS: http://192.168.1.xxx:8000/api
// 🔧 Para DESARROLLO WEB: http://localhost:8000/api

const URL_BASE = "http://192.168.1.8:8000/api"; 

// 💡 Para encontrar tu IP:
// - Windows: Ejecuta 'ipconfig' en terminal
// - Linux/Mac: Ejecuta 'ifconfig' o 'ip addr'

const api = axios.create({
  baseURL: URL_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const rutasPublicas = ["/login", "/register", "/crearUsuarioPaciente"];

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
        console.log('🔑 Adding auth headers:', {
          Authorization: `Bearer ${token.substring(0, 20)}...`
        });
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
