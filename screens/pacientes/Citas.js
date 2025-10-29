import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { obtenerCitasPorPaciente } from "../../Src/Navegation/Services/CitasService";
import { AuthContext } from "../../Src/Navegation/AuthContext";

export default function Citas({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Usar el ID del usuario autenticado
  const pacienteId = user?.id || 1; // Fallback a 1 si no hay usuario

  const cargarCitas = async () => {
    try {
      console.log("🔄 Cargando citas para paciente:", pacienteId);
      console.log("🔍 DEBUG - Citas: Usuario actual:", user);
      const result = await obtenerCitasPorPaciente(pacienteId);

      if (result.success) {
        setCitas(result.citas);
        console.log("✅ Citas cargadas:", result.citas.length);
        console.log("📋 Citas data:", result.citas);
      } else {
        console.log("❌ Error en respuesta:", result.message);
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("❌ Error al cargar citas:", error);
      Alert.alert("Error", "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarCitas();

    // Agregar listener para recargar cuando la pantalla recibe focus
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("🔄 Pantalla de Citas recibió focus, recargando citas...");
      setLoading(true); // Mostrar indicador de carga
      cargarCitas();
    });

    // Cleanup del listener
    return unsubscribe;
  }, [navigation]);

  // Efecto para manejar el parámetro refresh de la navegación
  useEffect(() => {
    if (route?.params?.refresh) {
      console.log("🔄 Refrescando citas después de crear una nueva...");
      setLoading(true);
      cargarCitas();
      // Limpiar el parámetro para evitar refrescos innecesarios
      navigation.setParams({ refresh: undefined });
    }
  }, [route?.params?.refresh, navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarCitas();
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "pendiente":
        return "#FFA500";
      case "confirmada":
        return "#28A745";
      case "cancelada":
        return "#DC3545";
      case "atendida":
        return "#17A2B8";
      default:
        return "#6C757D";
    }
  };

  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "confirmada":
        return "Confirmada";
      case "cancelada":
        return "Cancelada";
      case "atendida":
        return "Atendida";
      default:
        return "Desconocido";
    }
  };

  const renderCita = ({ item }) => (
    <View style={styles.citaCard}>
      <View style={styles.citaHeader}>
        <Text style={styles.citaFecha}>{formatearFecha(item.fecha_hora)}</Text>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: obtenerColorEstado(item.estado) },
          ]}
        >
          <Text style={styles.estadoTexto}>
            {obtenerTextoEstado(item.estado)}
          </Text>
        </View>
      </View>

      <View style={styles.citaInfo}>
        <Text style={styles.citaLabel}>Doctor:</Text>
        <Text style={styles.citaValue}>
          Dr. {item.doctor?.nombre} {item.doctor?.apellido}
        </Text>

        {item.doctor?.especialidad && (
          <>
            <Text style={styles.citaLabel}>Especialidad:</Text>
            <Text style={styles.citaValue}>
              {item.doctor.especialidad.nombre}
            </Text>
          </>
        )}

        {item.cubiculo && (
          <>
            <Text style={styles.citaLabel}>Consultorio:</Text>
            <Text style={styles.citaValue}>
              {item.cubiculo.nombre} - {item.cubiculo.tipo}
            </Text>
          </>
        )}

        {item.observaciones && (
          <>
            <Text style={styles.citaLabel}>Observaciones:</Text>
            <Text style={styles.citaValue}>{item.observaciones}</Text>
          </>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {citas.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No tienes citas programadas</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("CrearCita")}
          >
            <Text style={styles.primaryButtonText}>Agendar Primera Cita</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={citas}
          renderItem={renderCita}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Botón flotante para nueva cita */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("CrearCita")}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadingText: {
    fontSize: 16,
    color: "#6C757D",
  },
  emptyText: {
    fontSize: 18,
    color: "#6C757D",
    marginBottom: 20,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#28A745",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  citaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  citaFecha: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  citaInfo: {
    gap: 4,
  },
  citaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  citaValue: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 4,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007BFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});