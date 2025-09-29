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
import { AdminCubiculosService } from '../../Src/Navegation/Services/AdminService';

export default function AdminCubiculos() {
  const [cubiculos, setCubiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    nombre: '',
    tipo: 'consulta',
    equipamiento: '',
    estado: 'disponible',
    capacidad: '1'
  });

  // Cargar cubículos
  const cargarCubiculos = async () => {
    try {
      console.log("🔄 AdminCubiculos: Cargando cubículos");
      const response = await AdminCubiculosService.listarCubiculos();

      if (response.success) {
        setCubiculos(Array.isArray(response.data) ? response.data : []);
        console.log("✅ AdminCubiculos: Cubículos cargados exitosamente");
      } else {
        Alert.alert("Error", response.message);
        setCubiculos([]);
      }
    } catch (error) {
      console.error("❌ AdminCubiculos: Error cargando cubículos:", error);
      Alert.alert("Error", "Error al cargar cubículos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar cubículos al montar el componente
  useEffect(() => {
    cargarCubiculos();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarCubiculos();
  };

  // Filtrar cubículos por búsqueda
  const cubiculosFiltrados = Array.isArray(cubiculos) ? cubiculos.filter(cubiculo =>
    cubiculo.numero?.toString().includes(searchText) ||
    cubiculo.tipo?.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  // Crear cubículo
  const crearCubiculo = async () => {
    try {
      if (!formData.numero || !formData.nombre) {
        Alert.alert("Error", "Por favor complete los campos obligatorios (Número y Nombre)");
        return;
      }

      console.log("🔄 AdminCubiculos: Creando cubículo:", formData);
      const response = await AdminCubiculosService.crearCubiculo(formData);

      if (response.success) {
        Alert.alert("Éxito", "Cubículo creado exitosamente");
        setModalVisible(false);
        resetForm();
        cargarCubiculos();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("❌ AdminCubiculos: Error creando cubículo:", error);
      Alert.alert("Error", "Error al crear cubículo");
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      numero: '',
      nombre: '',
      tipo: 'consulta',
      equipamiento: '',
      estado: 'disponible',
      capacidad: '1'
    });
  };

  // Abrir modal para crear cubículo
  const abrirModalCrear = () => {
    resetForm();
    setModalVisible(true);
  };

  // Renderizar item de cubículo
  const renderCubiculo = ({ item }) => (
    <View style={styles.cubiculoItem}>
      <View style={styles.cubiculoInfo}>
        <Text style={styles.cubiculoNumero}>Cubículo #{item.numero}</Text>
        <Text style={styles.cubiculoNombre}>{item.nombre}</Text>
        <Text style={styles.cubiculoTipo}>Tipo: {item.tipo}</Text>
        <Text style={styles.cubiculoCapacidad}>Capacidad: {item.capacidad} personas</Text>
        <View style={[styles.estadoBadge, item.estado === 'disponible' ? styles.estadoDisponible : styles.estadoOcupado]}>
          <Text style={[styles.estadoText, item.estado === 'disponible' ? styles.estadoTextDisponible : styles.estadoTextOcupado]}>
            {item.estado || 'disponible'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Cubículos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={abrirModalCrear}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Crear Cubículo</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cubículos..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de cubículos */}
      <FlatList
        data={cubiculosFiltrados}
        renderItem={renderCubiculo}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loading ? "Cargando cubículos..." : "No se encontraron cubículos"}
            </Text>
          </View>
        }
      />

      {/* Modal para crear cubículo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crear Cubículo</Text>
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
                <Text style={styles.label}>Número *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.numero}
                  onChangeText={(text) => setFormData({...formData, numero: text})}
                  placeholder="Ingrese el número del cubículo"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({...formData, nombre: text})}
                  placeholder="Ej: Consulta General A"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo</Text>
                <View style={styles.tipoOptions}>
                  {['consulta', 'procedimientos', 'emergencia'].map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[styles.tipoOption, formData.tipo === tipo && styles.tipoOptionSelected]}
                      onPress={() => setFormData({...formData, tipo})}
                    >
                      <Text style={[styles.tipoOptionText, formData.tipo === tipo && styles.tipoOptionTextSelected]}>
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Equipamiento</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.equipamiento}
                  onChangeText={(text) => setFormData({...formData, equipamiento: text})}
                  placeholder="Ej: Camilla, monitor, equipo de rayos X..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Capacidad</Text>
                <TextInput
                  style={styles.input}
                  value={formData.capacidad}
                  onChangeText={(text) => setFormData({...formData, capacidad: text})}
                  placeholder="Número de personas"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Estado</Text>
                <View style={styles.tipoOptions}>
                  {['disponible', 'ocupado', 'mantenimiento'].map((estado) => (
                    <TouchableOpacity
                      key={estado}
                      style={[styles.tipoOption, formData.estado === estado && styles.tipoOptionSelected]}
                      onPress={() => setFormData({...formData, estado})}
                    >
                      <Text style={[styles.tipoOptionText, formData.estado === estado && styles.tipoOptionTextSelected]}>
                        {estado}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={crearCubiculo}
              >
                <Text style={styles.submitButtonText}>Crear Cubículo</Text>
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
    backgroundColor: '#06B6D4',
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
  cubiculoItem: {
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
  cubiculoInfo: {
    flex: 1,
  },
  cubiculoNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  cubiculoNombre: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    fontWeight: '600',
  },
  cubiculoTipo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  cubiculoCapacidad: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoDisponible: {
    backgroundColor: '#dcfce7',
  },
  estadoOcupado: {
    backgroundColor: '#fef3c7',
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  estadoTextDisponible: {
    color: '#166534',
  },
  estadoTextOcupado: {
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tipoOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  tipoOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  tipoOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  tipoOptionTextSelected: {
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