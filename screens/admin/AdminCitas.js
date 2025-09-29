import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminCitasService } from '../../Src/Navegation/Services/AdminService';

export default function AdminCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [formData, setFormData] = useState({
    paciente_id: '',
    doctor_id: '',
    especialidad_id: '',
    fecha_cita: '',
    hora_cita: '',
    estado: 'pendiente',
    observaciones: ''
  });

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

  // Actualizar cita
  const actualizarCita = async () => {
    try {
      console.log("🔄 AdminCitas: Actualizando cita:", editingCita.id, formData);
      const response = await AdminCitasService.actualizarCita(editingCita.id, formData);

      if (response.success) {
        Alert.alert("Éxito", "Cita actualizada exitosamente");
        setModalVisible(false);
        setEditingCita(null);
        resetForm();
        cargarCitas();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminCitas: Error actualizando cita:", error);
      Alert.alert("Error", "Error al actualizar cita");
    }
  };

  // Eliminar cita
  const eliminarCita = (cita) => {
    Alert.alert(
      "Eliminar Cita",
      `¿Estás seguro de que deseas eliminar esta cita?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🔄 AdminCitas: Eliminando cita:", cita.id);
              const response = await AdminCitasService.eliminarCita(cita.id);

              if (response.success) {
                Alert.alert("Éxito", "Cita eliminada exitosamente");
                cargarCitas();
              } else {
                Alert.alert("Error", response.message);
              }
            } catch (error) {
              console.error("❌ AdminCitas: Error eliminando cita:", error);
              Alert.alert("Error", "Error al eliminar cita");
            }
          }
        }
      ]
    );
  };

  // Cambiar estado de cita
  const cambiarEstadoCita = (cita, nuevoEstado) => {
    Alert.alert(
      "Cambiar Estado",
      `¿Cambiar estado de la cita a ${nuevoEstado}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cambiar",
          onPress: async () => {
            try {
              console.log("🔄 AdminCitas: Cambiando estado de cita:", cita.id, nuevoEstado);
              const response = await AdminCitasService.cambiarEstadoCita(cita.id, { estado: nuevoEstado });

              if (response.success) {
                Alert.alert("Éxito", "Estado de cita cambiado exitosamente");
                cargarCitas();
              } else {
                Alert.alert("Error", response.message);
              }
            } catch (error) {
              console.error("❌ AdminCitas: Error cambiando estado de cita:", error);
              Alert.alert("Error", "Error al cambiar estado de cita");
            }
          }
        }
      ]
    );
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      paciente_id: '',
      doctor_id: '',
      especialidad_id: '',
      fecha_cita: '',
      hora_cita: '',
      estado: 'pendiente',
      observaciones: ''
    });
  };

  // Abrir modal para editar cita
  const abrirModalEditar = (cita) => {
    setEditingCita(cita);
    setFormData({
      paciente_id: cita.paciente_id?.toString() || '',
      doctor_id: cita.doctor_id?.toString() || '',
      especialidad_id: cita.especialidad_id?.toString() || '',
      fecha_cita: cita.fecha_cita || '',
      hora_cita: cita.hora_cita || '',
      estado: cita.estado || 'pendiente',
      observaciones: cita.observaciones || ''
    });
    setModalVisible(true);
  };

  // Renderizar item de cita
  const renderCita = ({ item }) => (
    <View style={styles.citaItem}>
      <View style={styles.citaInfo}>
        <Text style={styles.citaFecha}>{item.fecha_cita} - {item.hora_cita}</Text>
        <Text style={styles.citaPaciente}>Paciente ID: {item.paciente_id}</Text>
        <Text style={styles.citaDoctor}>Doctor ID: {item.doctor_id}</Text>
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
      <View style={styles.citaAcciones}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => abrirModalEditar(item)}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => eliminarCita(item)}
        >
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

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

      {/* Modal para editar cita */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Cita</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Paciente ID</Text>
                <TextInput
                  style={styles.input}
                  value={formData.paciente_id}
                  onChangeText={(text) => setFormData({...formData, paciente_id: text})}
                  placeholder="ID del paciente"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Doctor ID</Text>
                <TextInput
                  style={styles.input}
                  value={formData.doctor_id}
                  onChangeText={(text) => setFormData({...formData, doctor_id: text})}
                  placeholder="ID del doctor"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha de Cita</Text>
                <TextInput
                  style={styles.input}
                  value={formData.fecha_cita}
                  onChangeText={(text) => setFormData({...formData, fecha_cita: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hora de Cita</Text>
                <TextInput
                  style={styles.input}
                  value={formData.hora_cita}
                  onChangeText={(text) => setFormData({...formData, hora_cita: text})}
                  placeholder="HH:MM"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estado</Text>
                <View style={styles.estadoOptions}>
                  {['pendiente', 'confirmada', 'completada', 'cancelada'].map((estado) => (
                    <TouchableOpacity
                      key={estado}
                      style={[styles.estadoOption, formData.estado === estado && styles.estadoOptionSelected]}
                      onPress={() => setFormData({...formData, estado})}
                    >
                      <Text style={[styles.estadoOptionText, formData.estado === estado && styles.estadoOptionTextSelected]}>
                        {estado}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observaciones</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.observaciones}
                  onChangeText={(text) => setFormData({...formData, observaciones: text})}
                  placeholder="Observaciones de la cita"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={actualizarCita}
              >
                <Text style={styles.submitButtonText}>Actualizar Cita</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
    padding: 15,
    marginBottom: 10,
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
  citaFecha: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  citaPaciente: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  citaDoctor: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
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
  editButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  estadoOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  estadoOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  estadoOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  estadoOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  estadoOptionTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});