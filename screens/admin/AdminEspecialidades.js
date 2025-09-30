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
import { AdminEspecialidadesService } from '../../Src/Navegation/Services/AdminService';

export default function AdminEspecialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEspecialidad, setEditingEspecialidad] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo'
  });

  // Cargar especialidades
  const cargarEspecialidades = async () => {
    try {
      console.log("🔄 AdminEspecialidades: Cargando especialidades");
      const response = await AdminEspecialidadesService.listarEspecialidades();

      if (response.success) {
        setEspecialidades(Array.isArray(response.data) ? response.data : []);
        console.log("✅ AdminEspecialidades: Especialidades cargadas exitosamente");
      } else {
        Alert.alert("Error", response.message);
        setEspecialidades([]);
      }
    } catch (error) {
      console.error("❌ AdminEspecialidades: Error cargando especialidades:", error);
      Alert.alert("Error", "Error al cargar especialidades");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar especialidades al montar el componente
  useEffect(() => {
    cargarEspecialidades();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarEspecialidades();
  };

  // Filtrar especialidades por búsqueda
  const especialidadesFiltradas = Array.isArray(especialidades) ? especialidades.filter(especialidad =>
    especialidad.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
    especialidad.descripcion?.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  // Crear especialidad
  const crearEspecialidad = async () => {
    try {
      if (!formData.nombre) {
        Alert.alert("Error", "Por favor ingrese el nombre de la especialidad");
        return;
      }

      console.log("🔄 AdminEspecialidades: Creando especialidad:", formData);
      const response = await AdminEspecialidadesService.crearEspecialidad(formData);

      if (response.success) {
        Alert.alert("Éxito", "Especialidad creada exitosamente");
        setModalVisible(false);
        resetForm();
        cargarEspecialidades();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminEspecialidades: Error creando especialidad:", error);
      Alert.alert("Error", "Error al crear especialidad");
    }
  };

  // Actualizar especialidad
  const actualizarEspecialidad = async () => {
    try {
      if (!formData.nombre) {
        Alert.alert("Error", "Por favor ingrese el nombre de la especialidad");
        return;
      }

      console.log("🔄 AdminEspecialidades: Actualizando especialidad:", editingEspecialidad.id, formData);
      const response = await AdminEspecialidadesService.actualizarEspecialidad(editingEspecialidad.id, formData);

      if (response.success) {
        Alert.alert("Éxito", "Especialidad actualizada exitosamente");
        setModalVisible(false);
        setEditingEspecialidad(null);
        resetForm();
        cargarEspecialidades();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminEspecialidades: Error actualizando especialidad:", error);
      Alert.alert("Error", "Error al actualizar especialidad");
    }
  };


  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'activo'
    });
  };

  // Abrir modal para crear especialidad
  const abrirModalCrear = () => {
    setEditingEspecialidad(null);
    resetForm();
    setModalVisible(true);
  };

  // Abrir modal para editar especialidad
  const abrirModalEditar = (especialidad) => {
    setEditingEspecialidad(especialidad);
    setFormData({
      nombre: especialidad.nombre || '',
      descripcion: especialidad.descripcion || '',
      estado: especialidad.estado || 'activo'
    });
    setModalVisible(true);
  };

  // Renderizar item de especialidad
  const renderEspecialidad = ({ item }) => (
    <View style={styles.especialidadItem}>
      <View style={styles.especialidadInfo}>
        <Text style={styles.especialidadNombre}>{item.nombre}</Text>
        <Text style={styles.especialidadDescripcion}>{item.descripcion}</Text>
        <View style={[styles.estadoBadge, item.estado === 'activo' ? styles.estadoActivo : styles.estadoInactivo]}>
          <Text style={[styles.estadoText, item.estado === 'activo' ? styles.estadoTextActivo : styles.estadoTextInactivo]}>
            {item.estado || 'activo'}
          </Text>
        </View>
      </View>
      <View style={styles.especialidadAcciones}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => abrirModalEditar(item)}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Especialidades</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={abrirModalCrear}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Crear Especialidad</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar especialidades..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de especialidades */}
      <FlatList
        data={especialidadesFiltradas}
        renderItem={renderEspecialidad}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="school" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando especialidades..." : "No se encontraron especialidades"}
            </Text>
          </View>
        }
      />

      {/* Modal para crear/editar especialidad */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingEspecialidad ? 'Editar Especialidad' : 'Crear Especialidad'}
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
                  placeholder="Ingrese el nombre de la especialidad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.descripcion}
                  onChangeText={(text) => setFormData({...formData, descripcion: text})}
                  placeholder="Ingrese la descripción"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={editingEspecialidad ? actualizarEspecialidad : crearEspecialidad}
              >
                <Text style={styles.submitButtonText}>
                  {editingEspecialidad ? 'Actualizar Especialidad' : 'Crear Especialidad'}
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
    backgroundColor: '#F59E0B',
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
  especialidadItem: {
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
  especialidadInfo: {
    flex: 1,
  },
  especialidadNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  especialidadDescripcion: {
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
  especialidadAcciones: {
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