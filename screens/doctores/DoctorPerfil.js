import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../Src/Navegation/AuthContext';
import { DoctorService } from '../../Src/Navegation/Services/DoctorService';

export default function DoctorPerfil({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    especialidad: '',
  });

  const { logout, user } = useContext(AuthContext);

  const cargarPerfil = async () => {
    try {
      console.log("🔄 Cargando perfil del doctor");
      const response = await DoctorService.obtenerMiPerfil();

      if (response.success) {
        console.log("✅ Perfil cargado exitosamente:", response.data.doctor);
        const doctor = response.data.doctor;

        setDoctorInfo({
          nombre: doctor.nombre || '',
          apellido: doctor.apellido || '',
          email: doctor.email || '',
          telefono: doctor.telefono || '',
          especialidad: doctor.especialidad ? doctor.especialidad.nombre : '',
        });
      } else {
        console.error("❌ Error en respuesta:", response.message);
        Alert.alert("Error", response.message || "Error al cargar el perfil");
      }
    } catch (error) {
      console.error("❌ Error cargando perfil:", error);
      Alert.alert("Error", "Error al cargar el perfil del doctor");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarPerfil();
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error("❌ Error cerrando sesión:", error);
            }
          }
        }
      ]
    );
  };

  const actualizarPerfil = () => {
    // Aquí podrías navegar a una pantalla de edición
    Alert.alert("Información", "Función de editar perfil próximamente");
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#10B981" />
        </View>
        <Text style={styles.doctorName}>
          Dr. {doctorInfo.nombre} {doctorInfo.apellido}
        </Text>
        <Text style={styles.especialidad}>{doctorInfo.especialidad}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#64748b" />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{doctorInfo.email || user?.email}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#64748b" />
          <Text style={styles.infoLabel}>Teléfono:</Text>
          <Text style={styles.infoValue}>{doctorInfo.telefono || 'No registrado'}</Text>
        </View>


        <View style={styles.infoItem}>
          <Ionicons name="medical-outline" size={20} color="#64748b" />
          <Text style={styles.infoLabel}>Especialidad:</Text>
          <Text style={styles.infoValue}>{doctorInfo.especialidad || 'No asignada'}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={actualizarPerfil}>
          <Ionicons name="create-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  especialidad: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  infoContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
    marginLeft: 8,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});