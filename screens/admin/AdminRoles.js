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
import { AdminRolesService } from '../../Src/Navegation/Services/AdminService';

export default function AdminRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
  });

  // Cargar roles
  const cargarRoles = async () => {
    try {
      console.log("🔄 AdminRoles: Cargando lista de roles");
      const response = await AdminRolesService.listarRoles();

      if (response.success) {
        setRoles(Array.isArray(response.data) ? response.data : []);
        console.log("✅ AdminRoles: Roles cargados exitosamente");
      } else {
        Alert.alert("Error", response.message);
        setRoles([]);
      }
    } catch (error) {
      console.error("❌ AdminRoles: Error cargando roles:", error);
      Alert.alert("Error", "Error al cargar roles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar roles al montar el componente
  useEffect(() => {
    cargarRoles();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarRoles();
  };

  // Filtrar roles por búsqueda
  const rolesFiltrados = Array.isArray(roles) ? roles.filter(role =>
    role.role?.toLowerCase().includes(searchText.toLowerCase()) ||
    role.rol?.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      role: '',
    });
  };

  // Abrir modal para ver detalles del rol
  const abrirModalDetalle = (role) => {
    setEditingRole(role);
    setFormData({
      role: role.role || role.rol || '',
    });
    setModalVisible(true);
  };

  // Renderizar item de rol
  const renderRole = ({ item }) => (
    <View style={styles.roleItem}>
      <View style={styles.roleInfo}>
        <Text style={styles.roleNombre}>{item.role || item.rol}</Text>
        <Text style={styles.roleId}>ID: {item.id}</Text>
        <Text style={styles.roleFecha}>
          Creado: {new Date(item.created_at).toLocaleDateString('es-CO')}
        </Text>
      </View>
      <View style={styles.roleAcciones}>
        <TouchableOpacity
          style={[styles.actionButton, styles.detailButton]}
          onPress={() => abrirModalDetalle(item)}
        >
          <Ionicons name="eye" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Roles</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.totalText}>Total: {roles.length} roles</Text>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar roles..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de roles */}
      <FlatList
        data={rolesFiltrados}
        renderItem={renderRole}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="shield" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando roles..." : "No se encontraron roles"}
            </Text>
          </View>
        }
      />

      {/* Modal para ver detalles del rol */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles del Rol</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.form}>
              {editingRole && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>ID del Rol</Text>
                    <Text style={styles.readOnlyInput}>{editingRole.id}</Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre del Rol</Text>
                    <Text style={styles.readOnlyInput}>{editingRole.role || editingRole.rol}</Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fecha de Creación</Text>
                    <Text style={styles.readOnlyInput}>
                      {new Date(editingRole.created_at).toLocaleString('es-CO')}
                    </Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Última Actualización</Text>
                    <Text style={styles.readOnlyInput}>
                      {new Date(editingRole.updated_at).toLocaleString('es-CO')}
                    </Text>
                  </View>

                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Información del Sistema</Text>
                    <Text style={styles.infoText}>
                      • Los roles definen los permisos de los usuarios{'\n'}
                      • No se pueden editar ni eliminar desde aquí{'\n'}
                      • Los cambios deben hacerse en el backend
                    </Text>
                  </View>
                </>
              )}
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
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
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
  roleItem: {
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
  roleInfo: {
    flex: 1,
  },
  roleNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  roleId: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  roleFecha: {
    fontSize: 12,
    color: '#9ca3af',
  },
  roleAcciones: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: '#3B82F6',
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
  readOnlyInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#1e293b',
  },
  infoSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});