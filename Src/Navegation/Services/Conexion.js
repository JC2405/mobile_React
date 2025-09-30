import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚙️ CONFIGURACIÓN DE IP PARA MÓVIL
// ===========================================
// Tu IP actual es: 10.2.232.70 (obtenida con ipconfig)

// Opciones según tu entorno de desarrollo:
// ===========================================
// 📱 Para EMULADOR ANDROID: http://10.0.2.2:8000/api
// 📱 Para DISPOSITIVO FÍSICO: http://10.2.232.70:8000/api
// 🏠 Para REDES DOMÉSTICAS: http://192.168.1.xxx:8000/api
// 🔧 Para DESARROLLO WEB: http://localhost:8000/api

// 🔥 SOLUCIÓN TEMPORAL: Usa ngrok para desarrollo móvil
// 1. Instala ngrok: https://ngrok.com/download
// 2. Ejecuta: ngrok http 8000
// 3. Usa la URL que proporcione ngrok (ej: https://abc123.ngrok.io/api)

const URL_BASE = "http://10.2.232.70:8000/api";

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

const rutasPublicas = ["/login", "/crearUsuarioPaciente"];

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

      // Limpiar datos de autenticación
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      console.log("🔐 Token inválido o expirado. Datos de sesión limpiados.");

      // Emitir evento personalizado para manejar logout en la aplicación
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
      }

      // También podrías intentar hacer refresh del token si tienes esa funcionalidad
      try {
        const refreshResponse = await api.post('/refresh');
        if (refreshResponse.data && refreshResponse.data.token) {
          const newToken = refreshResponse.data.token;
          await AsyncStorage.setItem('userToken', newToken);

          // Reintentar la solicitud original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log("❌ No se pudo refrescar el token:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
