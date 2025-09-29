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
import { AdminDoctoresService, AdminEspecialidadesService } from '../../Src/Navegation/Services/AdminService';

export default function AdminDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    telefono: '',
    especialidad_id: '',
    licencia_medica: '',
    experiencia_anios: '',
    educacion: ''
  });

  // Cargar doctores y especialidades
  const cargarDatos = async () => {
    try {
      console.log("🔄 AdminDoctores: Cargando datos");

      const [doctoresRes, especialidadesRes] = await Promise.all([
        AdminDoctoresService.listarDoctores(),
        AdminEspecialidadesService.listarEspecialidades()
      ]);

      if (doctoresRes.success) {
        setDoctores(Array.isArray(doctoresRes.data) ? doctoresRes.data : []);
      } else {
        setDoctores([]);
      }

      if (especialidadesRes.success) {
        setEspecialidades(Array.isArray(especialidadesRes.data) ? especialidadesRes.data : []);
      } else {
        setEspecialidades([]);
      }

      console.log("✅ AdminDoctores: Datos cargados exitosamente");
    } catch (error) {
      console.error("❌ AdminDoctores: Error cargando datos:", error);
      Alert.alert("Error", "Error al cargar datos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  // Filtrar doctores por búsqueda
  const doctoresFiltrados = Array.isArray(doctores) ? doctores.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  // Crear doctor
  const crearDoctor = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password || !formData.especialidad_id) {
        Alert.alert("Error", "Por favor complete todos los campos obligatorios");
        return;
      }

      console.log("🔄 AdminDoctores: Creando doctor:", formData);
      const response = await AdminDoctoresService.crearDoctor(formData);

      if (response.success) {
        Alert.alert("Éxito", "Doctor creado exitosamente");
        setModalVisible(false);
        resetForm();
        cargarDatos();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminDoctores: Error creando doctor:", error);
      Alert.alert("Error", "Error al crear doctor");
    }
  };

  // Actualizar doctor
  const actualizarDoctor = async () => {
    try {
      if (!formData.name || !formData.email || !formData.especialidad_id) {
        Alert.alert("Error", "Por favor complete los campos obligatorios");
        return;
      }

      console.log("🔄 AdminDoctores: Actualizando doctor:", editingDoctor.id, formData);
      const response = await AdminDoctoresService.actualizarDoctor(editingDoctor.id, formData);

      if (response.success) {
        Alert.alert("Éxito", "Doctor actualizado exitosamente");
        setModalVisible(false);
        setEditingDoctor(null);
        resetForm();
        cargarDatos();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminDoctores: Error actualizando doctor:", error);
      Alert.alert("Error", "Error al actualizar doctor");
    }
  };

  // Eliminar doctor
  const eliminarDoctor = (doctor) => {
    Alert.alert(
      "Eliminar Doctor",
      `¿Estás seguro de que deseas eliminar al doctor ${doctor.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🔄 AdminDoctores: Eliminando doctor:", doctor.id);
              const response = await AdminDoctoresService.eliminarDoctor(doctor.id);

              if (response.success) {
                Alert.alert("Éxito", "Doctor eliminado exitosamente");
                cargarDatos();
              } else {
                Alert.alert("Error", response.message);
              }
            } catch (error) {
              console.error("❌ AdminDoctores: Error eliminando doctor:", error);
              Alert.alert("Error", "Error al eliminar doctor");
            }
          }
        }
      ]
    );
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      telefono: '',
      especialidad_id: '',
      licencia_medica: '',
      experiencia_anios: '',
      educacion: ''
    });
  };

  // Abrir modal para crear doctor
  const abrirModalCrear = () => {
    setEditingDoctor(null);
    resetForm();
    setModalVisible(true);
  };

  // Abrir modal para editar doctor
  const abrirModalEditar = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      password: '', // No mostrar contraseña actual por seguridad
      telefono: doctor.telefono || '',
      especialidad_id: doctor.especialidad_id?.toString() || '',
      licencia_medica: doctor.licencia_medica || '',
      experiencia_anios: doctor.experiencia_anios?.toString() || '',
      educacion: doctor.educacion || ''
    });
    setModalVisible(true);
  };

  // Renderizar item de doctor
  const renderDoctor = ({ item }) => (
    <View style={styles.doctorItem}>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorNombre}>{item.name}</Text>
        <Text style={styles.doctorEmail}>{item.email}</Text>
        <Text style={styles.doctorEspecialidad}>
          Especialidad: {Array.isArray(especialidades) ? especialidades.find(e => e.id == item.especialidad_id)?.nombre || 'No especificada' : 'No especificada'}
        </Text>
        <Text style={styles.doctorTelefono}>{item.telefono}</Text>
      </View>
      <View style={styles.doctorAcciones}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => abrirModalEditar(item)}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => eliminarDoctor(item)}
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
        <Text style={styles.title}>Gestión de Doctores</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={abrirModalCrear}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Crear Doctor</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar doctores..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de doctores */}
      <FlatList
        data={doctoresFiltrados}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="medical" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando doctores..." : "No se encontraron doctores"}
            </Text>
          </View>
        }
      />

      {/* Modal para crear/editar doctor */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingDoctor ? 'Editar Doctor' : 'Crear Doctor'}
            </Text>
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
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Ingrese el nombre"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  placeholder="Ingrese el email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                  placeholder="Ingrese la contraseña"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({...formData, telefono: text})}
                  placeholder="Ingrese el teléfono"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Especialidad *</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                      // Aquí podrías implementar un picker modal para especialidades
                      Alert.alert("Seleccionar Especialidad", "Funcionalidad pendiente de implementar");
                    }}
                  >
                    <Text style={formData.especialidad_id ? styles.pickerText : styles.pickerPlaceholder}>
                      {formData.especialidad_id
                        ? (Array.isArray(especialidades) ? especialidades.find(e => e.id == formData.especialidad_id)?.nombre || 'Especialidad seleccionada' : 'Especialidad seleccionada')
                        : 'Seleccionar especialidad'
                      }
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Licencia Médica</Text>
                <TextInput
                  style={styles.input}
                  value={formData.licencia_medica}
                  onChangeText={(text) => setFormData({...formData, licencia_medica: text})}
                  placeholder="Ingrese el número de licencia"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Años de Experiencia</Text>
                <TextInput
                  style={styles.input}
                  value={formData.experiencia_anios}
                  onChangeText={(text) => setFormData({...formData, experiencia_anios: text})}
                  placeholder="Ingrese años de experiencia"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Educación</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.educacion}
                  onChangeText={(text) => setFormData({...formData, educacion: text})}
                  placeholder="Ingrese información educativa"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={editingDoctor ? actualizarDoctor : crearDoctor}
              >
                <Text style={styles.submitButtonText}>
                  {editingDoctor ? 'Actualizar Doctor' : 'Crear Doctor'}
                </Text>
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
    backgroundColor: '#10B981',
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
  doctorItem: {
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
  doctorInfo: {
    flex: 1,
  },
  doctorNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  doctorEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  doctorEspecialidad: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 2,
  },
  doctorTelefono: {
    fontSize: 12,
    color: '#64748b',
  },
  doctorAcciones: {
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#1e293b',
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: '#9ca3af',
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