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
import { AdminEPSService } from '../../Src/Navegation/Services/AdminService';

export default function AdminEPS() {
  const [eps, setEps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    nit: '',
    telefono: '',
    email: '',
    direccion: '',
    estado: 'activa'
  });

  // Cargar EPS activas
  const cargarEPS = async () => {
    try {
      console.log("🔄 AdminEPS: Cargando EPS");
      const response = await AdminEPSService.listarEPSActivas();

      if (response.success) {
        setEps(Array.isArray(response.data) ? response.data : []);
        console.log("✅ AdminEPS: EPS cargadas exitosamente");
      } else {
        Alert.alert("Error", response.message);
        setEps([]);
      }
    } catch (error) {
      console.error("❌ AdminEPS: Error cargando EPS:", error);
      Alert.alert("Error", "Error al cargar EPS");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar EPS al montar el componente
  useEffect(() => {
    cargarEPS();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarEPS();
  };

  // Filtrar EPS por búsqueda
  const epsFiltradas = Array.isArray(eps) ? eps.filter(ep =>
    ep.nombre?.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  // Cambiar estado de EPS
  const cambiarEstadoEPS = (ep) => {
    const nuevoEstado = ep.estado === 'activo' ? 'inactivo' : 'activo';
    Alert.alert(
      "Cambiar Estado",
      `¿Cambiar estado de ${ep.nombre} a ${nuevoEstado}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cambiar",
          onPress: async () => {
            try {
              console.log("🔄 AdminEPS: Cambiando estado de EPS:", ep.id, nuevoEstado);
              const response = await AdminEPSService.cambiarEstadoEPS({
                id: ep.id,
                estado: nuevoEstado
              });

              if (response.success) {
                Alert.alert("Éxito", "Estado de EPS cambiado exitosamente");
                cargarEPS();
              } else {
                Alert.alert("Error", response.message);
              }
            } catch (error) {
              console.error("❌ AdminEPS: Error cambiando estado de EPS:", error);
              Alert.alert("Error", "Error al cambiar estado de EPS");
            }
          }
        }
      ]
    );
  };

  // Crear EPS
  const crearEPS = async () => {
    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        Alert.alert("Error", "Por favor ingrese el nombre de la EPS");
        return;
      }

      if (!formData.codigo.trim()) {
        Alert.alert("Error", "Por favor ingrese el código de la EPS");
        return;
      }

      if (!formData.nit.trim()) {
        Alert.alert("Error", "Por favor ingrese el NIT de la EPS");
        return;
      }

      if (formData.codigo.length > 10) {
        Alert.alert("Error", "El código no puede tener más de 10 caracteres");
        return;
      }

      if (formData.nit.length > 20) {
        Alert.alert("Error", "El NIT no puede tener más de 20 caracteres");
        return;
      }

      if (formData.telefono && formData.telefono.length > 20) {
        Alert.alert("Error", "El teléfono no puede tener más de 20 caracteres");
        return;
      }

      if (formData.email && !formData.email.includes('@')) {
        Alert.alert("Error", "Por favor ingrese un email válido");
        return;
      }

      console.log("🔄 AdminEPS: Creando EPS:", formData);
      const response = await AdminEPSService.crearEPS(formData);

      if (response.success) {
        Alert.alert("Éxito", "EPS creada exitosamente");
        setModalVisible(false);
        resetForm();
        cargarEPS();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminEPS: Error creando EPS:", error);
      Alert.alert("Error", "Error al crear EPS");
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      codigo: '',
      nit: '',
      telefono: '',
      email: '',
      direccion: '',
      estado: 'activa'
    });
  };

  // Renderizar item de EPS
  const renderEPS = ({ item }) => (
    <View style={styles.epsItem}>
      <View style={styles.epsInfo}>
        <Text style={styles.epsNombre}>{item.nombre}</Text>
        <View style={[styles.estadoBadge, item.estado === 'activo' ? styles.estadoActivo : styles.estadoInactivo]}>
          <Text style={[styles.estadoText, item.estado === 'activo' ? styles.estadoTextActivo : styles.estadoTextInactivo]}>
            {item.estado || 'activo'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.actionButton, item.estado === 'activo' ? styles.deactivateButton : styles.activateButton]}
        onPress={() => cambiarEstadoEPS(item)}
      >
        <Ionicons
          name={item.estado === 'activo' ? 'pause' : 'play'}
          size={16}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de EPS</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Crear EPS</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar EPS..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de EPS */}
      <FlatList
        data={epsFiltradas}
        renderItem={renderEPS}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando EPS..." : "No se encontraron EPS"}
            </Text>
          </View>
        }
      />

      {/* Modal para crear EPS */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crear Nueva EPS</Text>
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
                <Text style={styles.label}>Nombre de la EPS *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({...formData, nombre: text})}
                  placeholder="Ej: Nueva EPS, SURA, Sanitas..."
                  maxLength={255}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Código *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.codigo}
                  onChangeText={(text) => setFormData({...formData, codigo: text})}
                  placeholder="Código único de la EPS"
                  maxLength={10}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NIT *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nit}
                  onChangeText={(text) => setFormData({...formData, nit: text})}
                  placeholder="Número de identificación tributaria"
                  maxLength={20}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({...formData, telefono: text})}
                  placeholder="Número de teléfono"
                  maxLength={20}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  placeholder="correo@empresa.com"
                  maxLength={255}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.direccion}
                  onChangeText={(text) => setFormData({...formData, direccion: text})}
                  placeholder="Dirección completa de la EPS"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estado *</Text>
                <View style={styles.estadoOptions}>
                  {[
                    { value: 'activa', label: 'Activa' },
                    { value: 'inactiva', label: 'Inactiva' }
                  ].map((estado) => (
                    <TouchableOpacity
                      key={estado.value}
                      style={[
                        styles.estadoOption,
                        formData.estado === estado.value && styles.estadoOptionSelected
                      ]}
                      onPress={() => setFormData({...formData, estado: estado.value})}
                    >
                      <Text style={[
                        styles.estadoOptionText,
                        formData.estado === estado.value && styles.estadoOptionTextSelected
                      ]}>
                        {estado.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={crearEPS}
              >
                <Text style={styles.submitButtonText}>Crear EPS</Text>
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
  epsItem: {
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
  epsInfo: {
    flex: 1,
  },
  epsNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
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
  actionButton: {
    padding: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activateButton: {
    backgroundColor: '#10B981',
  },
  deactivateButton: {
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
  estadoOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  estadoOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  estadoOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  estadoOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
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