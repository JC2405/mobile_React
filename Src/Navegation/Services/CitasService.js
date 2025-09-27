import api from "./Conexion";

export const obtenerCitasPorPaciente = async (pacienteId) => {
  try {
    console.log("🔄 Obteniendo citas para paciente:", pacienteId);
    const response = await api.get(`/citasPorPaciente/${pacienteId}`);
    console.log("✅ Citas obtenidas:", response.data);
    return { success: true, citas: response.data };
  } catch (error) {
    console.error("❌ Error al obtener citas:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener citas",
    };
  }
};

export const crearCita = async (citaData) => {
  try {
    console.log("🔄 Creando nueva cita:", citaData);
    const response = await api.post("/crearCita", citaData);
    console.log("✅ Cita creada:", response.data);
    return { success: true, cita: response.data };
  } catch (error) {
    console.error("❌ Error al crear cita:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Error al crear cita",
    };
  }
};

export const cambiarEstadoCita = async (citaId, estado) => {
  try {
    console.log("🔄 Cambiando estado de cita:", { citaId, estado });
    const response = await api.patch(`/cambiarEstadoCita/${citaId}`, { estado });
    console.log("✅ Estado de cita actualizado:", response.data);
    return { success: true, cita: response.data };
  } catch (error) {
    console.error("❌ Error al cambiar estado:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Error al cambiar estado",
    };
  }
};

export const obtenerEspecialidades = async () => {
  try {
    console.log("🔄 Obteniendo especialidades");
    const response = await api.get("/listarEspecialidades");
    console.log("✅ Especialidades obtenidas:", response.data);
    return { success: true, especialidades: response.data };
  } catch (error) {
    console.error("❌ Error al obtener especialidades:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener especialidades",
    };
  }
};

export const obtenerDoctor = async (doctorId) => {
  try {
    console.log("🔄 Obteniendo doctor:", doctorId);
    const response = await api.get(`/doctor/${doctorId}`);
    console.log("✅ Doctor obtenido:", response.data);
    return { success: true, doctor: response.data };
  } catch (error) {
    console.error("❌ Error al obtener doctor:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener doctor",
    };
  }
};