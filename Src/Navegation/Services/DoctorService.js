import api from "./Conexion";

// ==================== SERVICIOS PARA DOCTORES ====================
export const DoctorService = {
  // Obtener información de una especialidad específica
  obtenerEspecialidad: async (especialidadId) => {
    try {
      console.log("🔄 DoctorService: Obteniendo especialidad:", especialidadId);
      const response = await api.get(`/especialidad/${especialidadId}`);
      console.log("✅ DoctorService: Especialidad obtenida exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error obteniendo especialidad:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener especialidad" };
    }
  },

  // Actualizar información del doctor
  actualizarPerfil: async (doctorId, doctorData) => {
    try {
      console.log("🔄 DoctorService: Actualizando perfil del doctor:", doctorId, doctorData);
      const response = await api.put(`/actualizarDoctor/${doctorId}`, doctorData);
      console.log("✅ DoctorService: Perfil actualizado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error actualizando perfil:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar perfil" };
    }
  },

  // Obtener citas del doctor
  obtenerMisCitas: async (doctorId) => {
    try {
      console.log("🔄 DoctorService: Obteniendo citas del doctor:", doctorId);
      const response = await api.get(`/citasPorDoctor/${doctorId}`);
      console.log("✅ DoctorService: Citas obtenidas exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error obteniendo citas:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener citas" };
    }
  },

  // Cambiar estado de una cita
  cambiarEstadoCita: async (citaId, estadoData) => {
    try {
      console.log("🔄 DoctorService: Cambiando estado de cita:", citaId, estadoData);
      const response = await api.patch(`/cambiarEstadoCita/${citaId}`, estadoData);
      console.log("✅ DoctorService: Estado de cita cambiado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error cambiando estado de cita:", error);
      return { success: false, message: error.response?.data?.message || "Error al cambiar estado de cita" };
    }
  },

  // Obtener información de un cubículo
  obtenerCubiculo: async (cubiculoId) => {
    try {
      console.log("🔄 DoctorService: Obteniendo información del cubículo:", cubiculoId);
      const response = await api.get(`/cubiculos/${cubiculoId}`);
      console.log("✅ DoctorService: Información del cubículo obtenida exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error obteniendo cubículo:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener información del cubículo" };
    }
  },

  // ==================== GESTIÓN DE PERFIL ====================

  // Obtener perfil del doctor
  obtenerMiPerfil: async () => {
    try {
      console.log("🔄 DoctorService: Obteniendo perfil del doctor");
      const response = await api.get(`/miPerfil`);
      console.log("✅ DoctorService: Perfil obtenido exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error obteniendo perfil:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener perfil" };
    }
  },

  // ==================== GESTIÓN DE HORARIOS ====================

  // Obtener horarios del doctor
  obtenerMisHorarios: async () => {
    try {
      console.log("🔄 DoctorService: Obteniendo horarios del doctor");
      const response = await api.get(`/misHorarios`);
      console.log("✅ DoctorService: Horarios obtenidos exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error obteniendo horarios:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener horarios" };
    }
  },

  // Crear nuevo horario
  crearHorario: async (horarioData) => {
    try {
      console.log("🔄 DoctorService: Creando horario:", horarioData);
      const response = await api.post(`/crearHorario`, horarioData);
      console.log("✅ DoctorService: Horario creado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error creando horario:", error);
      return { success: false, message: error.response?.data?.message || "Error al crear horario" };
    }
  },

  // Actualizar horario
  actualizarHorario: async (horarioId, horarioData) => {
    try {
      console.log("🔄 DoctorService: Actualizando horario:", horarioId, horarioData);
      const response = await api.put(`/actualizarHorario/${horarioId}`, horarioData);
      console.log("✅ DoctorService: Horario actualizado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error actualizando horario:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar horario" };
    }
  },

  // Eliminar horario
  eliminarHorario: async (horarioId) => {
    try {
      console.log("🔄 DoctorService: Eliminando horario:", horarioId);
      const response = await api.delete(`/eliminarHorario/${horarioId}`);
      console.log("✅ DoctorService: Horario eliminado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ DoctorService: Error eliminando horario:", error);
      return { success: false, message: error.response?.data?.message || "Error al eliminar horario" };
    }
  }
};

// ==================== SERVICIOS COMPARTIDOS (TODOS LOS ROLES) ====================
export const SharedService = {
  // Listar especialidades (disponible para todos)
  listarEspecialidades: async () => {
    try {
      console.log("🔄 SharedService: Listando especialidades");
      const response = await api.get("/listarEspecialidades");
      console.log("✅ SharedService: Especialidades listadas exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ SharedService: Error listando especialidades:", error);
      return { success: false, message: error.response?.data?.message || "Error al listar especialidades" };
    }
  },

  // Listar citas (disponible para todos)
  listarCitas: async () => {
    try {
      console.log("🔄 SharedService: Listando citas");
      const response = await api.get("/listarCitas");
      console.log("✅ SharedService: Citas listadas exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ SharedService: Error listando citas:", error);
      return { success: false, message: error.response?.data?.message || "Error al listar citas" };
    }
  },

  // Listar doctores (disponible para todos)
  listarDoctores: async () => {
    try {
      console.log("🔄 SharedService: Listando doctores");
      const response = await api.get("/listarDoctores");
      console.log("✅ SharedService: Doctores listados exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ SharedService: Error listando doctores:", error);
      return { success: false, message: error.response?.data?.message || "Error al listar doctores" };
    }
  },

  // Obtener información de usuario (disponible para todos)
  obtenerUsuario: async (usuarioId) => {
    try {
      console.log("🔄 SharedService: Obteniendo usuario:", usuarioId);
      const response = await api.get(`/usuario/${usuarioId}`);
      console.log("✅ SharedService: Usuario obtenido exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ SharedService: Error obteniendo usuario:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener usuario" };
    }
  },

  // Crear cita (disponible para todos)
  crearCita: async (citaData) => {
    try {
      console.log("🔄 SharedService: Creando cita:", citaData);
      const response = await api.post("/crearCita", citaData);
      console.log("✅ SharedService: Cita creada exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ SharedService: Error creando cita:", error);
      return { success: false, message: error.response?.data?.message || "Error al crear cita" };
    }
  },

  // Obtener información del usuario autenticado
  obtenerPerfil: async () => {
    try {
      console.log("🔄 SharedService: Obteniendo perfil del usuario autenticado");
      const response = await api.get("/me");
      console.log("✅ SharedService: Perfil obtenido exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ SharedService: Error obteniendo perfil:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener perfil" };
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      console.log("🔄 SharedService: Cerrando sesión");
      const response = await api.post("/logout");
      console.log("✅ SharedService: Sesión cerrada exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ SharedService: Error cerrando sesión:", error);
      return { success: false, message: error.response?.data?.message || "Error al cerrar sesión" };
    }
  },

  // Refrescar token
  refreshToken: async () => {
    try {
      console.log("🔄 SharedService: Refrescando token");
      const response = await api.post("/refresh");
      console.log("✅ SharedService: Token refrescado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ SharedService: Error refrescando token:", error);
      return { success: false, message: error.response?.data?.message || "Error al refrescar token" };
    }
  }
};

// ==================== SERVICIOS PARA PACIENTES ====================
export const PacienteService = {
  // Obtener información de un doctor específico
  obtenerDoctor: async (doctorId) => {
    try {
      console.log("🔄 PacienteService: Obteniendo doctor:", doctorId);
      const response = await api.get(`/doctor/${doctorId}`);
      console.log("✅ PacienteService: Doctor obtenido exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ PacienteService: Error obteniendo doctor:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener doctor" };
    }
  },

  // Obtener información de una cita específica
  obtenerCita: async (citaId) => {
    try {
      console.log("🔄 PacienteService: Obteniendo cita:", citaId);
      const response = await api.get(`/cita/${citaId}`);
      console.log("✅ PacienteService: Cita obtenida exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ PacienteService: Error obteniendo cita:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener cita" };
    }
  },

  // Obtener citas del paciente
  obtenerMisCitas: async (pacienteId) => {
    try {
      console.log("🔄 PacienteService: Obteniendo citas del paciente:", pacienteId);
      const response = await api.get(`/citasPorPaciente/${pacienteId}`);
      console.log("✅ PacienteService: Citas obtenidas exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ PacienteService: Error obteniendo citas:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener citas" };
    }
  }
};