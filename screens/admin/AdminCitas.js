import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminCitasService } from '../../Src/Navegation/Services/AdminService';

export default function AdminCitas() {
   const [citas, setCitas] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const [searchText, setSearchText] = useState('');

  // Cargar citas
  const cargarCitas = async () => {
    try {
      console.log("🔄 AdminCitas: Cargando citas");
      const response = await AdminCitasService.listarCitas();

      if (response.success) {
        setCitas(response.data);
        console.log("✅ AdminCitas: Citas cargadas exitosamente");
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminCitas: Error cargando citas:", error);
      Alert.alert("Error", "Error al cargar citas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar citas al montar el componente
  useEffect(() => {
    cargarCitas();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarCitas();
  };

  // Filtrar citas por búsqueda
  const citasFiltradas = citas.filter(cita =>
    cita.observaciones?.toLowerCase().includes(searchText.toLowerCase()) ||
    cita.estado?.toLowerCase().includes(searchText.toLowerCase())
  );


  // Función para formatear fecha y hora
  const formatearFechaHora = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return {
        fecha: fecha.toLocaleDateString('es-CO', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        hora: fecha.toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    } catch (error) {
      return { fecha: fechaStr, hora: '' };
    }
  };

  // Renderizar item de cita
  const renderCita = ({ item }) => {
    const fechaFormateada = formatearFechaHora(item.fecha_hora);

    return (
      <View style={styles.citaItem}>
        <View style={styles.citaHeader}>
          <View style={styles.fechaContainer}>
            <Ionicons name="calendar" size={18} color="#3B82F6" />
            <Text style={styles.fecha}>{fechaFormateada.fecha}</Text>
            <Text style={styles.hora}>{fechaFormateada.hora}</Text>
          </View>
          <View style={[styles.estadoBadge,
            item.estado === 'pendiente' ? styles.estadoPendiente :
            item.estado === 'confirmada' ? styles.estadoConfirmada :
            item.estado === 'cancelada' ? styles.estadoCancelada :
            styles.estadoCompletada
          ]}>
            <Text style={[styles.estadoText,
              item.estado === 'pendiente' ? styles.estadoTextPendiente :
              item.estado === 'confirmada' ? styles.estadoTextConfirmada :
              item.estado === 'cancelada' ? styles.estadoTextCancelada :
              styles.estadoTextCompletada
            ]}>
              {item.estado || 'pendiente'}
            </Text>
          </View>
        </View>

        <View style={styles.citaInfo}>
          <View style={styles.personaContainer}>
            <Ionicons name="person" size={16} color="#64748b" />
            <View style={styles.personaInfo}>
              <Text style={styles.personaNombre}>
                {item.paciente?.nombre} {item.paciente?.apellido}
              </Text>
              <Text style={styles.personaDetalle}>
                Paciente • CC: {item.paciente?.documento_identidad}
              </Text>
            </View>
          </View>

          <View style={styles.personaContainer}>
            <Ionicons name="medical" size={16} color="#64748b" />
            <View style={styles.personaInfo}>
              <Text style={styles.personaNombre}>
                {item.doctor?.nombre} {item.doctor?.apellido}
              </Text>
              <Text style={styles.personaDetalle}>
                {item.doctor?.especialidad?.nombre || 'Especialidad no disponible'}
              </Text>
            </View>
          </View>

          {item.cubiculo && (
            <View style={styles.cubiculoContainer}>
              <Ionicons name="location" size={16} color="#64748b" />
              <Text style={styles.cubiculoTexto}>
                Cubículo {item.cubiculo.nombre}
              </Text>
            </View>
          )}

          {item.observaciones && (
            <View style={styles.observacionesContainer}>
              <Ionicons name="document-text" size={16} color="#64748b" />
              <Text style={styles.observacionesTexto}>
                {item.observaciones}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Citas</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar citas..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de citas */}
      <FlatList
        data={citasFiltradas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando citas..." : "No se encontraron citas"}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1e293b',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  citaItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fecha: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 8,
    marginRight: 10,
  },
  hora: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 5,
  },
  citaInfo: {
    gap: 12,
  },
  personaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  personaInfo: {
    marginLeft: 10,
    flex: 1,
  },
  personaNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  personaDetalle: {
    fontSize: 14,
    color: '#64748b',
  },
  cubiculoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  cubiculoTexto: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  observacionesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
  },
  observacionesTexto: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
    lineHeight: 20,
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoPendiente: { backgroundColor: '#fef3c7' },
  estadoConfirmada: { backgroundColor: '#dbeafe' },
  estadoCompletada: { backgroundColor: '#dcfce7' },
  estadoCancelada: { backgroundColor: '#fee2e2' },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  estadoTextPendiente: { color: '#92400e' },
  estadoTextConfirmada: { color: '#1e40af' },
  estadoTextCompletada: { color: '#166534' },
  estadoTextCancelada: { color: '#dc2626' },
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