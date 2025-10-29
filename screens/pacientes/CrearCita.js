import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import TextInputComponent from "../../components/inputComponent";
import PickerComponent from "../../components/PickerComponent";
import DatePickerComponent from "../../components/DatePickerComponent";
import {
  crearCita,
  obtenerEspecialidades,
  obtenerDoctor,
  obtenerHorariosDisponibles
} from "../../Src/Navegation/Services/CitasService";
import api from "../../Src/Navegation/Services/Conexion";

export default function CrearCita({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    paciente_id: "1", // Por ahora usamos un paciente de prueba
    doctor_id: "",
    fecha_hora: "",
    estado: "pendiente",
    observaciones: "",
    cubiculo_id: "",
  });

  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoadingData(true);
      console.log("🔄 Cargando datos reales de la base de datos...");

      // Get real specialties from database
      const especialidadesResult = await obtenerEspecialidades();
      if (especialidadesResult.success) {
        setEspecialidades(especialidadesResult.especialidades || []);
        console.log("✅ Especialidades cargadas:", especialidadesResult.especialidades?.length || 0);
      }

      // Get real doctors from database
      const doctoresResult = await api.get('/listarDoctores');
      if (doctoresResult.data) {
        // Handle different response formats
        let doctoresData = [];
        if (Array.isArray(doctoresResult.data)) {
          doctoresData = doctoresResult.data;
        } else if (doctoresResult.data.data && Array.isArray(doctoresResult.data.data)) {
          doctoresData = doctoresResult.data.data;
        }

        setDoctores(doctoresData);
        console.log("✅ Doctores cargados:", doctoresData.length);
        console.log("📋 Doctores:", doctoresData.map(d => `${d.nombre} ${d.apellido} - ${d.especialidad_id}`));
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      Alert.alert("Error", "No se pudieron cargar los datos iniciales");
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDoctorChange = (doctorId) => {
    if (doctorId) {
      // Buscar información del doctor en los datos reales
      const doctor = doctores.find(d => d.id === parseInt(doctorId));
      if (doctor) {
        setDoctorInfo(doctor);
        // Establecer todos los datos del formulario incluyendo cubiculo_id
        setFormData((prev) => ({
          ...prev,
          doctor_id: doctorId,
          fecha_hora: "", // Limpiar hora cuando cambia el doctor
          cubiculo_id: doctor.cubiculo_id ? doctor.cubiculo_id.toString() : "",
        }));
        console.log("✅ Doctor seleccionado:", doctor);
        console.log("📋 Doctor data:", {
          id: doctor.id,
          nombre: doctor.nombre,
          apellido: doctor.apellido,
          especialidad_id: doctor.especialidad_id,
          cubiculo_id: doctor.cubiculo_id
        });
      }
    } else {
      setDoctorInfo(null);
      // Limpiar datos cuando no hay doctor seleccionado
      setFormData((prev) => ({
        ...prev,
        doctor_id: doctorId,
        fecha_hora: "", // Limpiar hora cuando cambia el doctor
        cubiculo_id: "", // Limpiar cubiculo cuando cambia el doctor
      }));
    }

    // Limpiar horarios disponibles
    setHorariosDisponibles([]);
  };

  const handleFechaChange = (fecha) => {
    setFormData((prev) => ({
      ...prev,
      fecha_hora: fecha,
    }));

    // Si hay un doctor seleccionado, cargar horarios disponibles
    if (formData.doctor_id && fecha) {
      cargarHorariosDisponibles(formData.doctor_id, fecha);
    }
  };

  const cargarHorariosDisponibles = async (doctorId, fecha) => {
    try {
      console.log("🔄 Cargando horarios disponibles para doctor:", doctorId, "fecha:", fecha);
      const result = await obtenerHorariosDisponibles(doctorId, fecha);

      if (result.success) {
        setHorariosDisponibles(result.horarios || []);
        console.log("✅ Horarios disponibles cargados:", result.horarios?.length || 0);
      } else {
        console.error("❌ Error al cargar horarios:", result.message);
        setHorariosDisponibles([]);
        Alert.alert("Error", "No se pudieron cargar los horarios disponibles");
      }
    } catch (error) {
      console.error("❌ Error al cargar horarios disponibles:", error);
      setHorariosDisponibles([]);
      Alert.alert("Error", "Error al conectar con el servidor");
    }
  };

  const handleSubmit = async () => {
    // Validar campos requeridos
    if (!formData.doctor_id || !formData.fecha_hora || formData.fecha_hora.split(' ').length < 2) {
      Alert.alert("Error", "Por favor complete todos los campos requeridos (doctor, fecha y hora)");
      return;
    }

    setLoading(true);
    try {
      console.log("🔄 Creando cita con datos:", formData);
      console.log("🔍 cubiculo_id en formData:", formData.cubiculo_id);
      const result = await crearCita(formData);

      if (result.success) {
        Alert.alert(
          "Éxito",
          "Cita creada correctamente",
          [
            {
              text: "OK",
              onPress: () => {
                // Navegar a la pestaña de Citas y refrescar
                navigation.navigate('Citas');
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("❌ Error al crear cita:", error);
      Alert.alert("Error", "No se pudo crear la cita");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Agendar Nueva Cita</Text>
        <Text style={styles.subtitle}>Complete la información de su cita</Text>

        <View style={styles.form}>
          {/* Selección de Doctor con Especialidad */}
          <PickerComponent
            label="Doctor *"
            placeholder="Seleccione un doctor"
            value={formData.doctor_id}
            onValueChange={handleDoctorChange}
            items={doctores.map(doctor => ({
              ...doctor,
              nombre: `${doctor.nombre} ${doctor.apellido}`,
              especialidad: especialidades.find(esp => esp.id === parseInt(doctor.especialidad_id))?.nombre || `ID: ${doctor.especialidad_id}`
            }))}
            displayKey="nombre"
            valueKey="id"
            showEspecialidad={true}
          />

          {/* Información del doctor seleccionado */}
          {doctorInfo && (
            <View style={styles.doctorInfo}>
              <Text style={styles.infoTitle}>Información del Doctor:</Text>
              <Text style={styles.infoText}>
                👨‍⚕️ Nombre: {doctorInfo.nombre} {doctorInfo.apellido}
              </Text>
              <Text style={styles.infoText}>
                📧 Email: {doctorInfo.email || "No disponible"}
              </Text>
              <Text style={styles.infoText}>
                📞 Teléfono: {doctorInfo.telefono || "No disponible"}
              </Text>
              {doctorInfo.cubiculo_id && (
                <Text style={styles.infoText}>
                  🏥 Consultorio: {doctorInfo.cubiculo_id}
                </Text>
              )}
              {doctorInfo.especialidad_id && (
                <Text style={styles.infoText}>
                  🏥 Especialidad: {especialidades.find(esp => esp.id === parseInt(doctorInfo.especialidad_id))?.nombre || `ID: ${doctorInfo.especialidad_id}`}
                </Text>
              )}
            </View>
          )}

          {/* Fecha */}
          <DatePickerComponent
            label="Fecha *"
            placeholder="Seleccione una fecha"
            value={formData.fecha_hora.split(' ')[0] || ''}
            onChange={(fecha) => {
              const horaActual = formData.fecha_hora.split(' ')[1] || '';
              handleFechaChange(fecha + (horaActual ? ' ' + horaActual : ''));
            }}
            minimumDate={new Date()} // No permitir fechas pasadas
          />

          {/* Horarios disponibles */}
          {formData.doctor_id && formData.fecha_hora.split(' ')[0] && (
            <PickerComponent
              label="Hora Disponible *"
              placeholder="Seleccione una hora"
              value={formData.fecha_hora.split(' ')[1] || ''}
              onValueChange={(hora) => {
                const fecha = formData.fecha_hora.split(' ')[0];
                handleInputChange("fecha_hora", fecha + ' ' + hora);
              }}
              items={horariosDisponibles}
              displayKey="hora_display"
              valueKey="id"
            />
          )}

          {/* Observaciones */}
          <TextInputComponent
            label="Observaciones (Opcional)"
            placeholder="Motivo de la consulta, síntomas, etc."
            value={formData.observaciones}
            onChangeText={(value) => handleInputChange("observaciones", value)}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.buttonText}>Creando Cita...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Agendar Cita</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2E8F0",
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginLeft: 2,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 12,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
  },
  loadingText: {
    fontSize: 16,
    color: "#6C757D",
    marginTop: 12,
  },
  doctorInfo: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007BFF",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#495057",
    marginBottom: 4,
  },
});