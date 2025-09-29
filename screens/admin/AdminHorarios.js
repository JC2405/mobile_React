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
import { AdminHorariosService } from '../../Src/Navegation/Services/AdminService';

export default function AdminHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '',
    dia_semana: 'lunes',
    hora_inicio: '',
    hora_fin: '',
    estado: 'activo'
  });

  // Cargar horarios
  const cargarHorarios = async () => {
    try {
      console.log("🔄 AdminHorarios: Cargando horarios");
      const response = await AdminHorariosService.listarHorarios();

      if (response.success) {
        setHorarios(Array.isArray(response.data) ? response.data : []);
        console.log("✅ AdminHorarios: Horarios cargados exitosamente");
      } else {
        Alert.alert("Error", response.message);
        setHorarios([]);
      }
    } catch (error) {
      console.error("❌ AdminHorarios: Error cargando horarios:", error);
      Alert.alert("Error", "Error al cargar horarios");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar horarios al montar el componente
  useEffect(() => {
    cargarHorarios();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarHorarios();
  };

  // Filtrar horarios por búsqueda
  const horariosFiltrados = Array.isArray(horarios) ? horarios.filter(horario =>
    horario.dia_semana?.toLowerCase().includes(searchText.toLowerCase()) ||
    horario.hora_inicio?.includes(searchText)
  ) : [];

  // Crear horario
  const crearHorario = async () => {
    try {
      if (!formData.doctor_id || !formData.hora_inicio || !formData.hora_fin) {
        Alert.alert("Error", "Por favor complete todos los campos obligatorios");
        return;
      }

      console.log("🔄 AdminHorarios: Creando horario:", formData);
      const response = await AdminHorariosService.crearHorario(formData);

      if (response.success) {
        Alert.alert("Éxito", "Horario creado exitosamente");
        setModalVisible(false);
        resetForm();
        cargarHorarios();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminHorarios: Error creando horario:", error);
      Alert.alert("Error", "Error al crear horario");
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      doctor_id: '',
      dia_semana: 'lunes',
      hora_inicio: '',
      hora_fin: '',
      estado: 'activo'
    });
  };

  // Abrir modal para crear horario
  const abrirModalCrear = () => {
    resetForm();
    setModalVisible(true);
  };

  // Renderizar item de horario
  const renderHorario = ({ item }) => (
    <View style={styles.horarioItem}>
      <View style={styles.horarioInfo}>
        <Text style={styles.horarioDia}>Día: {item.dia_semana}</Text>
        <Text style={styles.horarioHora}>{item.hora_inicio} - {item.hora_fin}</Text>
        <Text style={styles.horarioDoctor}>Doctor ID: {item.doctor_id}</Text>
        <View style={[styles.estadoBadge, item.estado === 'activo' ? styles.estadoActivo : styles.estadoInactivo]}>
          <Text style={[styles.estadoText, item.estado === 'activo' ? styles.estadoTextActivo : styles.estadoTextInactivo]}>
            {item.estado || 'activo'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Horarios</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={abrirModalCrear}
        >
          <Ionicons name="time" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Crear Horario</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar horarios..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de horarios */}
      <FlatList
        data={horariosFiltrados}
        renderItem={renderHorario}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="time" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando horarios..." : "No se encontraron horarios"}
            </Text>
          </View>
        }
      />

      {/* Modal para crear horario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crear Horario</Text>
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
                <Text style={styles.label}>Doctor ID *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.doctor_id}
                  onChangeText={(text) => setFormData({...formData, doctor_id: text})}
                  placeholder="Ingrese el ID del doctor"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Día de la Semana</Text>
                <View style={styles.diaOptions}>
                  {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((dia) => (
                    <TouchableOpacity
                      key={dia}
                      style={[styles.diaOption, formData.dia_semana === dia && styles.diaOptionSelected]}
                      onPress={() => setFormData({...formData, dia_semana: dia})}
                    >
                      <Text style={[styles.diaOptionText, formData.dia_semana === dia && styles.diaOptionTextSelected]}>
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hora de Inicio *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.hora_inicio}
                  onChangeText={(text) => setFormData({...formData, hora_inicio: text})}
                  placeholder="HH:MM"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hora de Fin *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.hora_fin}
                  onChangeText={(text) => setFormData({...formData, hora_fin: text})}
                  placeholder="HH:MM"
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={crearHorario}
              >
                <Text style={styles.submitButtonText}>Crear Horario</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
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
  horarioItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  horarioInfo: {
    gap: 4,
  },
  horarioDia: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  horarioHora: {
    fontSize: 14,
    color: '#64748b',
  },
  horarioDoctor: {
    fontSize: 12,
    color: '#64748b',
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  estadoActivo: {
    backgroundColor: '#dcfce7',
  },
  estadoInactivo: {
    backgroundColor: '#fef3c7',
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  estadoTextActivo: {
    color: '#166534',
  },
  estadoTextInactivo: {
    color: '#92400e',
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
  diaOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  diaOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  diaOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  diaOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  diaOptionTextSelected: {
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