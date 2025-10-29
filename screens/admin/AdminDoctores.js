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
import { Picker } from '@react-native-picker/picker';
import { AdminDoctoresService, AdminEspecialidadesService, AdminRolesService, AdminCubiculosService } from '../../Src/Navegation/Services/AdminService';

export default function AdminDoctores() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cubiculos, setCubiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    especialidad_id: '',
    cubiculo_id: '',
    rol_id: '2'
  });

  // Cargar doctores, especialidades, roles y cubículos
  const cargarDatos = async () => {
    try {
      console.log("🔄 AdminDoctores: Cargando datos");

      const [doctoresRes, especialidadesRes, rolesRes, cubiculosRes] = await Promise.all([
        AdminDoctoresService.listarDoctores(),
        AdminEspecialidadesService.listarEspecialidades(),
        AdminRolesService.listarRoles(),
        AdminCubiculosService.listarCubiculos()
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

      if (rolesRes.success) {
        setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
      } else {
        setRoles([]);
      }

      if (cubiculosRes.success) {
        setCubiculos(Array.isArray(cubiculosRes.data) ? cubiculosRes.data : []);
      } else {
        setCubiculos([]);
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
      if (!formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.especialidad_id || !formData.rol_id) {
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
      if (!formData.nombre || !formData.apellido || !formData.email || !formData.especialidad_id) {
        Alert.alert("Error", "Por favor complete los campos obligatorios");
        return;
      }

      // Filtrar datos para no enviar password vacío
      const dataToSend = { ...formData };
      if (!dataToSend.password || dataToSend.password.trim() === '') {
        delete dataToSend.password;
      }

      // Convertir strings vacíos a null para campos opcionales
      if (dataToSend.telefono === '') dataToSend.telefono = null;
      if (dataToSend.cubiculo_id === '') dataToSend.cubiculo_id = null;

      console.log("🔄 AdminDoctores: Actualizando doctor:", editingDoctor.id, dataToSend);
      const response = await AdminDoctoresService.actualizarDoctor(editingDoctor.id, dataToSend);

      if (response.success) {
        Alert.alert("Éxito", "Doctor actualizado exitosamente");
        setModalVisible(false);
        setEditingDoctor(null);
        resetForm();
        cargarDatos();
      } else {
        Alert.alert("Error", response.message || "Error al actualizar doctor");
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
      `¿Estás seguro de que deseas eliminar al doctor ${doctor.nombre} ${doctor.apellido}?`,
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
                Alert.alert("Éxito", response.message || "Doctor eliminado exitosamente");
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
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      especialidad_id: '',
      cubiculo_id: '',
      rol_id: '2'
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
      nombre: doctor.nombre || '',
      apellido: doctor.apellido || '',
      email: doctor.email || '',
      password: '', // No mostrar contraseña actual por seguridad
      telefono: doctor.telefono || '',
      especialidad_id: doctor.especialidad_id?.toString() || '',
      cubiculo_id: doctor.cubiculo_id?.toString() || '',
      rol_id: doctor.rol_id?.toString() || '2' // Default to doctor role
    });
    setModalVisible(true);
  };

  // Renderizar item de doctor
  const renderDoctor = ({ item }) => (
    <View style={styles.doctorItem}>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorNombre}>{item.nombre} {item.apellido}</Text>
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
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({...formData, nombre: text})}
                  placeholder="Ingrese el nombre"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Apellido *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.apellido}
                  onChangeText={(text) => setFormData({...formData, apellido: text})}
                  placeholder="Ingrese el apellido"
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
                <Text style={styles.label}>Contraseña {editingDoctor ? '(dejar vacío para mantener)' : '*'}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                  placeholder={editingDoctor ? "Dejar vacío para mantener contraseña actual" : "Ingrese la contraseña"}
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
                <Picker
                  selectedValue={formData.especialidad_id}
                  onValueChange={(value) => setFormData({...formData, especialidad_id: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar especialidad..." value="" />
                  {Array.isArray(especialidades) && especialidades.map((especialidad) => (
                    <Picker.Item key={especialidad.id} label={especialidad.nombre} value={especialidad.id.toString()} />
                  ))}
                </Picker>
              </View>


              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cubículo</Text>
                <Picker
                  selectedValue={formData.cubiculo_id}
                  onValueChange={(value) => setFormData({...formData, cubiculo_id: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar cubículo (opcional)..." value="" />
                  {Array.isArray(cubiculos) && cubiculos.map((cubiculo) => (
                    <Picker.Item key={cubiculo.id} label={`Cubículo ${cubiculo.numero}`} value={cubiculo.id.toString()} />
                  ))}
                </Picker>
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
  picker: {
    height: 50,
    color: '#1e293b',
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