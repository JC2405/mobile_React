import api from "./Conexion";

export const loginUser = async (email, password) => {
    try {
      console.log("🔄 Intentando login con:", { email, password });
      const response = await api.post("/login", { email, password });
      console.log("✅ Respuesta del servidor:", response.data);
      console.log("📊 Status:", response.status);

      // 🔍 DEBUG: Analizar información del usuario y rol
      console.log("🔍 DEBUG - Información completa del usuario:", response.data.user);
      console.log("🔍 DEBUG - Campos disponibles en user:", Object.keys(response.data.user || {}));
      console.log("🔍 DEBUG - Rol del usuario:", response.data.user?.rol);
      console.log("🔍 DEBUG - Tipo de rol:", typeof response.data.user?.rol);
      console.log("🔍 DEBUG - ID del rol:", response.data.user?.idrol);
      console.log("🔍 DEBUG - Tipo de idrol:", typeof response.data.user?.idrol);
      console.log("🔍 DEBUG - Guard utilizado:", response.data.guard);
      console.log("🔍 DEBUG - Token recibido:", response.data.access_token ? "SÍ" : "NO");

      // Verificar si el usuario parece ser admin (máxima protección)
      let userRol = '';
      let userIdRol = null;

      try {
        if (response.data.user?.rol !== null && response.data.user?.rol !== undefined) {
          userRol = String(response.data.user.rol).toLowerCase();
        }
        if (response.data.user?.idrol !== null && response.data.user?.idrol !== undefined) {
          userIdRol = Number(response.data.user.idrol) || response.data.user.idrol;
        }
      } catch (error) {
        console.error("🔍 DEBUG - Error procesando rol en AuthService:", error);
        userRol = '';
        userIdRol = null;
      }
      const isAdmin = userRol === 'admin' || userRol === '1' || userIdRol === 1 || userIdRol === '1';

      console.log("🔍 DEBUG - userRol procesado:", userRol);
      console.log("🔍 DEBUG - userIdRol procesado:", userIdRol);
      console.log("🔍 DEBUG - ¿Es admin según datos del servidor?:", isAdmin);

      const accessToken = response.data.access_token;
      const userGuard = response.data.guard;
      console.log("🔑 Token recibido:", accessToken ? "SÍ" : "NO");
      console.log("🔍 DEBUG - Guard recibido:", userGuard);

      if (!accessToken) {
        console.error("❌ No se recibió token en la respuesta");
        return { success: false, message: "No se recibió token en la respuesta" };
      }

      // Verificar si es admin basado en el guard recibido
      const isAdminByGuard = userGuard === 'api_admin';
      console.log("🔍 DEBUG - ¿Es admin según guard?:", isAdminByGuard);

      console.log("✅ Login exitoso, retornando token");
      console.log("🔍 DEBUG - Usuario completo antes de retornar:", response.data.user);

      return {
        success: true,
        token: accessToken,
        user: response.data.user || null,
        guard: userGuard,
        isAdmin: isAdminByGuard
      };
    } catch (error) {
      console.error("❌ Error en login:", error);
      console.error("📊 Error response:", error.response?.data);
      console.error("📊 Error status:", error.response?.status);
      console.error("📊 Error message:", error.message);

      return {
        success: false,
        message: error.response
          ? error.response.data.message || "Error del servidor"
          : "Error de conexión",
      };
    }
  };




export const registerUser = async (userData) => {
    try {
        console.log("🔄 Registrando usuario con datos:", userData);
        const response = await api.post("/crearUsuarioPaciente", userData);
        console.log("✅ Respuesta del registro:", response.data);
        return {
            success: true,
            message: response.data.message || "Usuario registrado correctamente",
            user: response.data.usuario || response.data.user
        };
    } catch (e) {
        console.error("❌ Error al registrar usuario:", e.response ? e.response.data : e.message);
        return {
            success: false,
            message: e.response ? e.response.data.message || "Error al registrar usuario" : "Error de conexión",
            errors: e.response ? e.response.data.errors : null
        };
    }
};
