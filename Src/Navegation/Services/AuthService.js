import api from "./Conexion";

export const loginUser = async (email, password) => {
   try {
     console.log("🔄 Intentando login con:", { email, password });
     const response = await api.post("/login", { email, password });
     console.log("✅ Respuesta del servidor:", response.data);
     console.log("📊 Status:", response.status);

     const accessToken = response.data.access_token;
     console.log("🔑 Token recibido:", accessToken ? "SÍ" : "NO");

     if (!accessToken) {
       console.error("❌ No se recibió token en la respuesta");
       return { success: false, message: "No se recibió token en la respuesta" };
     }

     console.log("✅ Login exitoso, retornando token");
     return {
       success: true,
       token: accessToken,
       user: response.data.user || null
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




export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post("/crearUsuarioPaciente", { name, email, password });
        console.log("Respuesta del registro", response.data);
        return {
            success: true,
            message: response.data.message || "Usuario registrado correctamente",
            user: response.data.user
        };
    } catch (e) {
        console.log(
            "Error al registrar usuario",
            e.response ? e.response.data : e.message,
        );
        return {
            success: false,
            message: e.response ? e.response.data.message || "Error al registrar usuario" : "Error de conexión",
        };
    }
};
