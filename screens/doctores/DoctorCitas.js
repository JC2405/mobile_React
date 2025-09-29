import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorCitas() {
  const [citas, setCitas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargarCitas = async () => {
    try {
      // Aquí consumirías el endpoint: GET /citasPorDoctor/{doctor_id}
      console.log("🔄 Cargando citas del doctor");
      // const response = await DoctorService.obtenerMisCitas();
      // setCitas(response.data);
    } catch (error) {
      console.error("❌ Error cargando citas:", error);
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
      // Aquí consumirías el endpoint: PATCH /cambiarEstadoCita/{id}
      console.log("🔄 Cambiando estado de cita:", citaId, nuevoEstado);
      // await DoctorService.cambiarEstadoCita(citaId, nuevoEstado);
      cargarCitas(); // Recargar lista
    } catch (error) {
      console.error("❌ Error cambiando estado:", error);
    }
  };

  const renderCita = ({ item }) => (
    <View style={styles.citaItem}>
      <View style={styles.citaInfo}>
        <Text style={styles.pacienteNombre}>Paciente: {item.paciente_nombre}</Text>
        <Text style={styles.citaFecha}>{item.fecha} - {item.hora}</Text>
        <Text style={styles.citaEstado}>Estado: {item.estado}</Text>
      </View>
      <View style={styles.citaAcciones}>
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
      </View>
    </View>
  );

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