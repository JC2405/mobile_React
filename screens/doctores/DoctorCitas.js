import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../Src/Navegation/AuthContext';
import { DoctorService } from '../../Src/Navegation/Services/DoctorService';

export default function DoctorCitas() {
  const [citas, setCitas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const cargarCitas = async () => {
    try {
      if (!user?.id) {
        console.log("❌ No hay usuario autenticado");
        return;
      }

      console.log("🔄 Cargando citas del doctor:", user.id);
      const response = await DoctorService.obtenerMisCitas(user.id);

      if (response.success) {
        console.log("✅ Citas cargadas exitosamente:", response.data.length);
        setCitas(response.data);
      } else {
        console.error("❌ Error en respuesta:", response.message);
        Alert.alert("Error", response.message || "Error al cargar citas");
      }
    } catch (error) {
      console.error("❌ Error cargando citas:", error);
      Alert.alert("Error", "Error al cargar las citas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarCitas();
  };

  const cambiarEstadoCita = async (citaId, nuevoEstado) => {
    try {
      console.log("🔄 Cambiando estado de cita:", citaId, "a", nuevoEstado);
      const response = await DoctorService.cambiarEstadoCita(citaId, { estado: nuevoEstado });

      if (response.success) {
        console.log("✅ Estado de cita cambiado exitosamente");
        Alert.alert("Éxito", `Cita ${nuevoEstado === 'completada' ? 'completada' : 'cancelada'} exitosamente`);
        cargarCitas(); // Recargar lista
      } else {
        console.error("❌ Error en respuesta:", response.message);
        Alert.alert("Error", response.message || "Error al cambiar estado de la cita");
      }
    } catch (error) {
      console.error("❌ Error cambiando estado:", error);
      Alert.alert("Error", "Error al cambiar el estado de la cita");
    }
  };

  const formatDateTime = (fechaHora) => {
    const date = new Date(fechaHora);
    const fecha = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const hora = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { fecha, hora };
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return '#F59E0B'; // amarillo
      case 'confirmada': return '#3B82F6'; // azul
      case 'completada': return '#10B981'; // verde
      case 'cancelada': return '#EF4444'; // rojo
      case 'atendida': return '#8B5CF6'; // morado
      default: return '#6B7280'; // gris
    }
  };

  const renderCita = ({ item }) => {
    const { fecha, hora } = formatDateTime(item.fecha_hora);
    const pacienteNombre = item.paciente ?
      `${item.paciente.nombre} ${item.paciente.apellido || ''}`.trim() :
      'Paciente desconocido';

    return (
      <View style={styles.citaItem}>
        <View style={styles.citaInfo}>
          <Text style={styles.pacienteNombre}>Paciente: {pacienteNombre}</Text>
          <Text style={styles.citaFecha}>{fecha} - {hora}</Text>
          <Text style={[styles.citaEstado, { color: getEstadoColor(item.estado) }]}>
            Estado: {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
          </Text>
          {item.cubiculo && (
            <Text style={styles.cubiculoInfo}>Consultorio: {item.cubiculo.nombre || item.cubiculo.id}</Text>
          )}
        </View>
        <View style={styles.citaAcciones}>
          {(item.estado === 'pendiente' || item.estado === 'confirmada') && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.completarButton]}
                onPress={() => cambiarEstadoCita(item.id, 'completada')}
              >
                <Ionicons name="checkmark" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelarButton]}
                onPress={() => cambiarEstadoCita(item.id, 'cancelada')}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
        <Text style={styles.subtitle}>Gestiona tus citas médicas</Text>
      </View>

      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando citas..." : "No tienes citas programadas"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  citaItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  citaInfo: {
    flex: 1,
  },
  pacienteNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  citaFecha: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  citaEstado: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  cubiculoInfo: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  citaAcciones: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completarButton: {
    backgroundColor: '#10B981',
  },
  cancelarButton: {
    backgroundColor: '#EF4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 10,
  },
});