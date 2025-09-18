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




export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post("api/register", { name, email, password });
        console.log("Respuesta del registro", response.data);
        return { success: true, message: response.data.message, user: response.data.user };
    } catch (e) {
        console.log(
            "Error al registrar usuario",
            e.response ? e.response.data : e.message,
        );
        return {
            success: false,
            message: e.response ? e.response.data : "Error de conexión",
        };
    }
};
