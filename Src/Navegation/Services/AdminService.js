import api from "./Conexion";

// ==================== SERVICIOS PARA ROLES ====================
export const AdminRolesService = {
  // Listar todos los roles
  listarRoles: async () => {
    try {
      console.log("🔄 AdminRolesService: Listando roles");
      const response = await api.get("/indexRol");
      console.log("✅ AdminRolesService: Roles listados exitosamente");
      console.log("📊 Datos de roles recibidos:", response.data);

      // Handle different response formats
      let rolesData = [];
      if (response.data.roles) {
        rolesData = response.data.roles;
      } else if (Array.isArray(response.data)) {
        rolesData = response.data;
      } else if (response.data.data) {
        rolesData = response.data.data;
      } else {
        rolesData = [];
      }

      return { success: true, data: rolesData };
    } catch (error) {
      console.error("❌ AdminRolesService: Error listando roles:", error);
      console.error("❌ Error response:", error.response?.data);
      return { success: false, message: error.response?.data?.message || "Error al listar roles" };
    }
  }
};

// ==================== SERVICIOS PARA USUARIOS ====================
export const AdminUsuariosService = {
  // Listar todos los usuarios del modelo User
  listarUsuarios: async () => {
    try {
      console.log("🔄 AdminUsuariosService: Listando usuarios");
      const response = await api.get("/listarUsuariosAuth");
      console.log("✅ AdminUsuariosService: Usuarios listados exitosamente");
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error("❌ AdminUsuariosService: Error listando usuarios:", error);
      return { success: false, message: error.response?.data?.message || "Error al listar usuarios" };
    }
  },

  // Crear nuevo usuario
  crearUsuario: async (usuarioData) => {
    try {
      console.log("🔄 AdminUsuariosService: Creando usuario:", usuarioData);

      // Send data directly as expected by backend AuthController@crearUsuario
      const backendData = {
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido,
        documento_identidad: usuarioData.documento_identidad,
        email: usuarioData.email,
        password: usuarioData.password,
        telefono: usuarioData.telefono || null,
        fecha_nacimiento: usuarioData.fecha_nacimiento,
        eps_id: usuarioData.eps_id || null,
        rol_id: usuarioData.rol_id
      };

      const response = await api.post("/register", backendData);
      console.log("✅ AdminUsuariosService: Usuario creado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminUsuariosService: Error creando usuario:", error);
      return { success: false, message: error.response?.data?.message || "Error al crear usuario" };
    }
  },

  // Actualizar usuario del modelo User
  actualizarUsuario: async (id, usuarioData) => {
    try {
      console.log("🔄 AdminUsuariosService: Actualizando usuario:", id, usuarioData);

      // Map frontend fields to backend fields for User model
      const backendData = {
        name: usuarioData.name,
        email: usuarioData.email,
      };

      // Only include password if it's provided (for security)
      if (usuarioData.password) {
        backendData.password = usuarioData.password;
      }

      const response = await api.put(`/actualizarUsuarioAuth/${id}`, backendData);
      console.log("✅ AdminUsuariosService: Usuario actualizado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminUsuariosService: Error actualizando usuario:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar usuario" };
    }
  },

  // Eliminar usuario del modelo User
  eliminarUsuario: async (id) => {
    try {
      console.log("🔄 AdminUsuariosService: Eliminando usuario:", id);
      const response = await api.delete(`/eliminarUsuarioAuth/${id}`);
      console.log("✅ AdminUsuariosService: Usuario eliminado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminUsuariosService: Error eliminando usuario:", error);
      return { success: false, message: error.response?.data?.message || "Error al eliminar usuario" };
    }
  }
};

// ==================== SERVICIOS PARA DOCTORES ====================
export const AdminDoctoresService = {
  // Listar todos los doctores
  listarDoctores: async () => {
    try {
      console.log("🔄 AdminDoctoresService: Listando doctores");
      const response = await api.get("/listarDoctores");
      console.log("✅ AdminDoctoresService: Doctores listados exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminDoctoresService: Error listando doctores:", error);
      return { success: false, message: error.response?.data?.message || "Error al listar doctores" };
    }
  },

  // Crear nuevo doctor
  crearDoctor: async (doctorData) => {
    try {
      console.log("🔄 AdminDoctoresService: Creando doctor:", doctorData);
      const response = await api.post("/CrearUsuarioDoctor", doctorData);
      console.log("✅ AdminDoctoresService: Doctor creado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminDoctoresService: Error creando doctor:", error);
      return { success: false, message: error.response?.data?.message || "Error al crear doctor" };
    }
  },

  // Actualizar doctor
  actualizarDoctor: async (id, doctorData) => {
    try {
      console.log("🔄 AdminDoctoresService: Actualizando doctor:", id, doctorData);
      const response = await api.put(`/actualizarDoctor/${id}`, doctorData);
      console.log("✅ AdminDoctoresService: Doctor actualizado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminDoctoresService: Error actualizando doctor:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar doctor" };
    }
  },

  // Eliminar doctor
  eliminarDoctor: async (id) => {
    try {
      console.log("🔄 AdminDoctoresService: Eliminando doctor:", id);
      const response = await api.delete(`/eliminarDoctor/${id}`);
      console.log("✅ AdminDoctoresService: Doctor eliminado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminDoctoresService: Error eliminando doctor:", error);
      return { success: false, message: error.response?.data?.message || "Error al eliminar doctor" };
    }
  },

  // Doctores por especialidad
  doctoresPorEspecialidad: async (especialidadId) => {
    try {
      console.log("🔄 AdminDoctoresService: Obteniendo doctores por especialidad:", especialidadId);
      const response = await api.get(`/doctoresPorEspecialidad/${especialidadId}`);
      console.log("✅ AdminDoctoresService: Doctores por especialidad obtenidos exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminDoctoresService: Error obteniendo doctores por especialidad:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener doctores por especialidad" };
    }
  }
};

// ==================== SERVICIOS PARA ESPECIALIDADES ====================
export const AdminEspecialidadesService = {
  // Listar todas las especialidades
  listarEspecialidades: async () => {
    try {
      console.log("🔄 AdminEspecialidadesService: Listando especialidades");
      const response = await api.get("/listarEspecialidades");
      console.log("✅ AdminEspecialidadesService: Especialidades listadas exitosamente");
      console.log("📊 Respuesta completa:", response.data);

      // Extract data array from response
      let especialidadesData = [];
      if (response.data.data) {
        especialidadesData = response.data.data;
        console.log("📊 Datos extraídos:", especialidadesData);
      } else if (Array.isArray(response.data)) {
        especialidadesData = response.data;
      } else {
        especialidadesData = [];
      }

      return { success: true, data: especialidadesData };
    } catch (error) {
      console.error("❌ AdminEspecialidadesService: Error listando especialidades:", error);
      console.error("❌ Error response:", error.response?.data);
      return { success: false, message: error.response?.data?.message || "Error al listar especialidades" };
    }
  },

  // Crear nueva especialidad
  crearEspecialidad: async (especialidadData) => {
    try {
      console.log("🔄 AdminEspecialidadesService: Creando especialidad:", especialidadData);
      const response = await api.post("/crearEspecialidad", especialidadData);
      console.log("✅ AdminEspecialidadesService: Especialidad creada exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminEspecialidadesService: Error creando especialidad:", error);
      return { success: false, message: error.response?.data?.message || "Error al crear especialidad" };
    }
  },

  // Actualizar especialidad
  actualizarEspecialidad: async (id, especialidadData) => {
    try {
      console.log("🔄 AdminEspecialidadesService: Actualizando especialidad:", id, especialidadData);
      const response = await api.put(`/actualizarEspecialidad/${id}`, especialidadData);
      console.log("✅ AdminEspecialidadesService: Especialidad actualizada exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminEspecialidadesService: Error actualizando especialidad:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar especialidad" };
    }
  },

  // Eliminar especialidad
  eliminarEspecialidad: async (id) => {
    try {
      console.log("🔄 AdminEspecialidadesService: Eliminando especialidad:", id);
      const response = await api.delete(`/eliminarEspecialidad/${id}`);
      console.log("✅ AdminEspecialidadesService: Especialidad eliminada exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminEspecialidadesService: Error eliminando especialidad:", error);
      return { success: false, message: error.response?.data?.message || "Error al eliminar especialidad" };
    }
  }
};

// ==================== SERVICIOS PARA CITAS ====================
export const AdminCitasService = {
  // Listar todas las citas
  listarCitas: async () => {
    try {
      console.log("🔄 AdminCitasService: Listando citas");
      const response = await api.get("/listarCitas");
      console.log("✅ AdminCitasService: Citas listadas exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminCitasService: Error listando citas:", error);
      return { success: false, message: error.response?.data?.message || "Error al listar citas" };
    }
  },

  // Actualizar cita
  actualizarCita: async (id, citaData) => {
    try {
      console.log("🔄 AdminCitasService: Actualizando cita:", id, citaData);
      const response = await api.put(`/actualizarCita/${id}`, citaData);
      console.log("✅ AdminCitasService: Cita actualizada exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminCitasService: Error actualizando cita:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar cita" };
    }
  },

  // Eliminar cita
  eliminarCita: async (id) => {
    try {
      console.log("🔄 AdminCitasService: Eliminando cita:", id);
      const response = await api.delete(`/eliminarCita/${id}`);
      console.log("✅ AdminCitasService: Cita eliminada exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminCitasService: Error eliminando cita:", error);
      return { success: false, message: error.response?.data?.message || "Error al eliminar cita" };
    }
  },

  // Cambiar estado de cita
  cambiarEstadoCita: async (id, estadoData) => {
    try {
      console.log("🔄 AdminCitasService: Cambiando estado de cita:", id, estadoData);
      const response = await api.patch(`/cambiarEstadoCita/${id}`, estadoData);
      console.log("✅ AdminCitasService: Estado de cita cambiado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminCitasService: Error cambiando estado de cita:", error);
      return { success: false, message: error.response?.data?.message || "Error al cambiar estado de cita" };
    }
  }
};

// ==================== SERVICIOS PARA EPS ====================
export const AdminEPSService = {
  // Listar EPS activas
  listarEPSActivas: async () => {
    try {
      console.log("🔄 AdminEPSService: Listando EPS activas");
      const response = await api.get("/eps/activas/list");
      console.log("✅ AdminEPSService: EPS activas listadas exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminEPSService: Error listando EPS activas:", error);
      return { success: false, message: error.response?.data?.message || "Error al listar EPS activas" };
    }
  },

  // Crear nueva EPS
  crearEPS: async (epsData) => {
    try {
      console.log("🔄 AdminEPSService: Creando EPS:", epsData);
      const response = await api.post("/eps", epsData);
      console.log("✅ AdminEPSService: EPS creada exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminEPSService: Error creando EPS:", error);
      return { success: false, message: error.response?.data?.message || "Error al crear EPS" };
    }
  },

  // Cambiar estado de EPS
  cambiarEstadoEPS: async (epsData) => {
    try {
      console.log("🔄 AdminEPSService: Cambiando estado de EPS:", epsData);
      const response = await api.patch("/e/cambiar-estado", epsData);
      console.log("✅ AdminEPSService: Estado de EPS cambiado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminEPSService: Error cambiando estado de EPS:", error);
      return { success: false, message: error.response?.data?.message || "Error al cambiar estado de EPS" };
    }
  }
};

// ==================== SERVICIOS PARA CUBÍCULOS ====================
export const AdminCubiculosService = {
  // Listar todos los cubículos
  listarCubiculos: async () => {
    try {
      console.log("🔄 AdminCubiculosService: Listando cubículos");
      const response = await api.get("/listarCubiculos");
      console.log("✅ AdminCubiculosService: Cubículos listados exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminCubiculosService: Error listando cubículos:", error);
      return { success: false, message: error.response?.data?.message || "Error al listar cubículos" };
    }
  },

  // Crear nuevo cubículo
  crearCubiculo: async (cubiculoData) => {
    try {
      console.log("🔄 AdminCubiculosService: Creando cubículo:", cubiculoData);
      const response = await api.post("/crearCubiculo", cubiculoData);
      console.log("✅ AdminCubiculosService: Cubículo creado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminCubiculosService: Error creando cubículo:", error);
      return { success: false, message: error.response?.data?.message || "Error al crear cubículo" };
    }
  },

  // Cubículos disponibles
  cubiculosDisponibles: async () => {
    try {
      console.log("🔄 AdminCubiculosService: Obteniendo cubículos disponibles");
      const response = await api.get("/cubiculos/disponibles/list");
      console.log("✅ AdminCubiculosService: Cubículos disponibles obtenidos exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminCubiculosService: Error obteniendo cubículos disponibles:", error);
      return { success: false, message: error.response?.data?.message || "Error al obtener cubículos disponibles" };
    }
  }
};

// ==================== SERVICIOS PARA HORARIOS ====================
export const AdminHorariosService = {
  // Listar todos los horarios
  listarHorarios: async () => {
    try {
      console.log("🔄 AdminHorariosService: Listando horarios");
      const response = await api.get("/listarHorarios");
      console.log("✅ AdminHorariosService: Horarios listados exitosamente");
      console.log("📊 Respuesta completa:", response.data);

      // Extract data array from response
      let horariosData = [];
      if (response.data.horarios) {
        horariosData = response.data.horarios.map(horario => ({
          ...horario,
          dia_semana: horario.dia // Map dia to dia_semana for frontend
        }));
        console.log("📊 Datos extraídos:", horariosData);
      } else if (Array.isArray(response.data)) {
        horariosData = response.data;
      } else {
        horariosData = [];
      }

      return { success: true, data: horariosData };
    } catch (error) {
      console.error("❌ AdminHorariosService: Error listando horarios:", error);
      console.error("❌ Error response:", error.response?.data);
      return { success: false, message: error.response?.data?.message || "Error al listar horarios" };
    }
  },

  // Crear nuevo horario
  crearHorario: async (horarioData) => {
    try {
      console.log("🔄 AdminHorariosService: Creando horario:", horarioData);

      // Map frontend fields to backend fields
      const backendData = {
        ...horarioData,
        dia: horarioData.dia_semana // Map dia_semana to dia
      };
      delete backendData.dia_semana; // Remove frontend field

      const response = await api.post("/crearHorario", backendData);
      console.log("✅ AdminHorariosService: Horario creado exitosamente");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ AdminHorariosService: Error creando horario:", error);
      return { success: false, message: error.response?.data?.message || "Error al crear horario" };
    }
  }
};