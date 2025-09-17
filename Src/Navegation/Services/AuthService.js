import api from "./Conexion";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    const token = response.data.token;
    console.log("Respuesta del servidor:", response.data);

    if (!token) {
      return { success: false, message: "No se recibió token en la respuesta" };
    }

    return { success: true, token };
  } catch (error) {
    console.error(
      "Error al iniciar sesión: ",
      error.response ? error.response.data : error.message
    );

    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : "Error de conexión",
    };
  }
};
