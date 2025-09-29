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
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { AdminUsuariosService, AdminRolesService } from '../../Src/Navegation/Services/AdminService';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Cargar usuarios
  const cargarUsuarios = async () => {
    try {
      console.log("🔄 AdminUsuarios: Cargando lista de usuarios");
      const response = await AdminUsuariosService.listarUsuarios();

      if (response.success) {
        setUsuarios(Array.isArray(response.data) ? response.data : []);
        console.log("✅ AdminUsuarios: Usuarios cargados exitosamente");
      } else {
        Alert.alert("Error", response.message);
        setUsuarios([]); // Asegurar que usuarios sea un array vacío en caso de error
      }
    } catch (error) {
      console.error("❌ AdminUsuarios: Error cargando usuarios:", error);
      Alert.alert("Error", "Error al cargar usuarios");
      setUsuarios([]); // Asegurar que usuarios sea un array vacío en caso de error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar roles
  const cargarRoles = async () => {
    try {
      console.log("🔄 AdminUsuarios: Cargando lista de roles (para información)");
      const response = await AdminRolesService.listarRoles();

      if (response.success) {
        setRoles(response.data);
        console.log("✅ AdminUsuarios: Roles cargados exitosamente (para información)");
      } else {
        console.warn("⚠️ AdminUsuarios: Error cargando roles (para información):", response.message);
      }
    } catch (error) {
      console.error("❌ AdminUsuarios: Error cargando roles (para información):", error);
    }
  };

  // Cargar usuarios y roles al montar el componente
  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarUsuarios();
  };

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(usuario =>
    (usuario.nombre || usuario.name)?.toLowerCase().includes(searchText.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Crear usuario
  const crearUsuario = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        Alert.alert("Error", "Por favor complete todos los campos obligatorios (Nombre, Email, Contraseña)");
        return;
      }

      if (formData.password.length < 4) {
        Alert.alert("Error", "La contraseña debe tener al menos 4 caracteres");
        return;
      }

      console.log("🔄 AdminUsuarios: Creando usuario:", formData);
      const response = await AdminUsuariosService.crearUsuario(formData);

      if (response.success) {
        Alert.alert("Éxito", "Usuario creado exitosamente");
        setModalVisible(false);
        resetForm();
        cargarUsuarios();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminUsuarios: Error creando usuario:", error);
      Alert.alert("Error", "Error al crear usuario");
    }
  };

  // Actualizar usuario
  const actualizarUsuario = async () => {
    try {
      if (!formData.name || !formData.email) {
        Alert.alert("Error", "Por favor complete los campos obligatorios (Nombre, Email)");
        return;
      }

      console.log("🔄 AdminUsuarios: Actualizando usuario:", editingUser.id, formData);
      const response = await AdminUsuariosService.actualizarUsuario(editingUser.id, formData);

      if (response.success) {
        Alert.alert("Éxito", "Usuario actualizado exitosamente");
        setModalVisible(false);
        setEditingUser(null);
        resetForm();
        cargarUsuarios();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminUsuarios: Error actualizando usuario:", error);
      Alert.alert("Error", "Error al actualizar usuario");
    }
  };

  // Eliminar usuario
  const eliminarUsuario = (usuario) => {
    Alert.alert(
      "Eliminar Usuario",
      `¿Estás seguro de que deseas eliminar al usuario ${usuario.nombre || usuario.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🔄 AdminUsuarios: Eliminando usuario:", usuario.id);
              const response = await AdminUsuariosService.eliminarUsuario(usuario.id);

              if (response.success) {
                Alert.alert("Éxito", "Usuario eliminado exitosamente");
                cargarUsuarios();
              } else {
                Alert.alert("Error", response.message);
              }
            } catch (error) {
              console.error("❌ AdminUsuarios: Error eliminando usuario:", error);
              Alert.alert("Error", "Error al eliminar usuario");
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
      password: ''
    });
  };

  // Abrir modal para crear usuario
  const abrirModalCrear = () => {
    setEditingUser(null);
    resetForm();
    setModalVisible(true);
  };

  // Abrir modal para editar usuario
  const abrirModalEditar = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      name: usuario.name || '',
      email: usuario.email || '',
      password: '' // No mostrar contraseña actual por seguridad
    });
    setModalVisible(true);
  };

  // Renderizar item de administrador
  const renderUsuario = ({ item }) => (
    <View style={styles.usuarioItem}>
      <View style={styles.usuarioInfo}>
        <Text style={styles.usuarioNombre}>{item.nombre || item.name}</Text>
        <Text style={styles.usuarioEmail}>{item.email}</Text>
        <Text style={styles.usuarioTelefono}>{item.telefono}</Text>
      </View>
      <View style={styles.usuarioAcciones}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => abrirModalEditar(item)}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => eliminarUsuario(item)}
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
        <Text style={styles.title}>Gestión de Usuarios</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={abrirModalCrear}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Crear Usuario</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuarios..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de usuarios */}
      <FlatList
        data={usuariosFiltrados}
        renderItem={renderUsuario}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando usuarios..." : "No se encontraron usuarios"}
            </Text>
          </View>
        }
      />

      {/* Modal para crear/editar usuario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingUser ? 'Editar Usuario' : 'Crear Usuario'}
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


              <TouchableOpacity
                style={styles.submitButton}
                onPress={editingUser ? actualizarUsuario : crearUsuario}
              >
                <Text style={styles.submitButtonText}>
                  {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
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
  usuarioItem: {
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
  usuarioInfo: {
    flex: 1,
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  usuarioTelefono: {
    fontSize: 12,
    color: '#64748b',
  },
  usuarioAcciones: {
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
    borderWidth: 0,
    paddingVertical: 0,
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