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
     console.log("📡 Raw response from specialties API:", response);

     // Handle different response formats
     let especialidadesData = [];
     if (response.data) {
       if (response.data.data) {
         // Laravel controller format: { success: true, data: [...] }
         especialidadesData = response.data.data;
       } else if (Array.isArray(response.data)) {
         // Direct array format: [...]
         especialidadesData = response.data;
       } else {
         console.warn("⚠️ Unexpected response format:", response.data);
         especialidadesData = [];
       }
     }

     console.log("✅ Datos de especialidades procesados:", especialidadesData);
     console.log("✅ Número de especialidades:", especialidadesData.length);
     return { success: true, especialidades: especialidadesData };
   } catch (error) {
     console.error("❌ Error al obtener especialidades:", error);
     console.error("❌ Error response:", error.response);
     console.error("❌ Error status:", error.response?.status);
     return {
       success: false,
       message: error.response?.data?.message || "Error al obtener especialidades",
       especialidades: []
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

export const obtenerConteoCitasPorPaciente = async (pacienteId) => {
   try {
     console.log("🔄 Obteniendo conteo de citas para paciente:", pacienteId);
     const response = await api.get(`/citasPorPaciente/${pacienteId}`);
     console.log("📡 Raw response from API:", response);
     const conteo = response.data ? response.data.length : 0;
     console.log("✅ Datos de citas recibidos:", response.data);
     console.log("✅ Conteo calculado:", conteo);
     return { success: true, conteo };
   } catch (error) {
     console.error("❌ Error al obtener conteo de citas:", error);
     console.error("❌ Error response:", error.response);
     console.error("❌ Error status:", error.response?.status);
     return {
       success: false,
       message: error.response?.data?.message || "Error al obtener conteo de citas",
       conteo: 0
     };
   }
 };

export const obtenerConteoEspecialidades = async () => {
     try {
       console.log("🔄 Obteniendo conteo de especialidades");
       const response = await api.get("/listarEspecialidades");
       console.log("📡 Raw response from specialties API:", response);

       // Handle different response formats
       let especialidadesData = [];
       if (response.data) {
         if (response.data.data) {
           // Laravel controller format: { success: true, data: [...] }
           especialidadesData = response.data.data;
         } else if (Array.isArray(response.data)) {
           // Direct array format: [...]
           especialidadesData = response.data;
         } else {
           console.warn("⚠️ Unexpected response format:", response.data);
           especialidadesData = [];
         }
       }

       const conteo = especialidadesData.length;
       console.log("✅ Datos de especialidades recibidos:", especialidadesData);
       console.log("✅ Conteo calculado:", conteo);
       return { success: true, conteo };
     } catch (error) {
       console.error("❌ Error al obtener conteo de especialidades:", error);
       console.error("❌ Error response:", error.response);
       console.error("❌ Error status:", error.response?.status);
       return {
         success: false,
         message: error.response?.data?.message || "Error al obtener conteo de especialidades",
         conteo: 0
       };
     }
   };

export const obtenerHorariosDisponibles = async (doctorId, fecha) => {
    try {
      console.log("🔄 Obteniendo horarios disponibles para doctor:", doctorId, "fecha:", fecha);
      const response = await api.get(`/horariosDisponibles/${doctorId}`, {
        params: { fecha }
      });
      console.log("📡 Raw response from horarios disponibles API:", response);

      // Handle different response formats
      let horariosData = [];
      if (response.data) {
        if (response.data.horas_disponibles) {
          // Expected format: { horas_disponibles: [...] }
          horariosData = response.data.horas_disponibles;
        } else if (Array.isArray(response.data)) {
          // Direct array format: [...]
          horariosData = response.data;
        } else {
          console.warn("⚠️ Unexpected response format:", response.data);
          horariosData = [];
        }
      }

      console.log("✅ Horarios disponibles obtenidos:", horariosData);
      return { success: true, horarios: horariosData };
    } catch (error) {
      console.error("❌ Error al obtener horarios disponibles:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error status:", error.response?.status);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener horarios disponibles",
        horarios: []
      };
    }
  };