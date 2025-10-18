import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from '@react-navigation/native';
import { SharedService } from '../../Src/Navegation/Services/DoctorService';

export default function DoctorHome() {
   const navigation = useNavigation();
   const [refreshing, setRefreshing] = useState(false);
   const [doctorInfo, setDoctorInfo] = useState(null);

   // Cargar información básica del doctor
   const cargarDatosDoctor = async () => {
     try {
       console.log("🔄 DoctorHome: Cargando datos del doctor");

       // Obtener información del usuario autenticado
       const perfilResponse = await SharedService.obtenerPerfil();

       if (perfilResponse.success) {
         const usuario = perfilResponse.data;
         setDoctorInfo(usuario);
       } else {
         Alert.alert("Error", "No se pudo obtener información del usuario");
       }
     } catch (error) {
       console.error("❌ DoctorHome: Error cargando datos del doctor:", error);
       Alert.alert("Error", "Error al cargar información del doctor");
     } finally {
       setRefreshing(false);
     }
   };

   // Cargar datos al montar el componente
   useEffect(() => {
     cargarDatosDoctor();
   }, []);

   const onRefresh = () => {
     setRefreshing(true);
     cargarDatosDoctor();
   };

   // Función para navegar a citas
   const navegarACitas = () => {
     navigation.navigate('DoctorCitas');
   };

   // Función para navegar a perfil
   const navegarAPerfil = () => {
     navigation.navigate('DoctorPerfil');
   };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
          <Text style={styles.doctorName}>
            Dr. {doctorInfo?.nombre} {doctorInfo?.apellido}
          </Text>
        </View>
        <View style={styles.dateSection}>
          <Ionicons name="medical" size={20} color="#3B82F6" />
          <Text style={styles.dateText}>
            Médico Especialista
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={navegarACitas}
        >
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.actionText}>Mis Citas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={navegarAPerfil}
        >
          <Ionicons name="person" size={24} color="#fff" />
          <Text style={styles.actionText}>Mi Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <Text style={styles.infoTitle}>Panel del Médico</Text>
          <Text style={styles.infoDescription}>
            Gestiona tus citas y mantén actualizada tu información profesional.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#f8fafc',
   },
   centered: {
     justifyContent: 'center',
     alignItems: 'center',
   },
   header: {
     padding: 20,
     backgroundColor: '#fff',
     borderBottomWidth: 1,
     borderBottomColor: '#e2e8f0',
   },
   welcomeSection: {
     marginBottom: 15,
   },
   welcomeText: {
     fontSize: 14,
     color: '#64748b',
     marginBottom: 4,
   },
   doctorName: {
     fontSize: 20,
     fontWeight: 'bold',
     color: '#1e293b',
   },
   dateSection: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   dateText: {
     fontSize: 14,
     color: '#64748b',
     marginLeft: 8,
   },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionsContainer: {
    padding: 20,
    gap: 16,
  },
  actionsContainer: {
    padding: 20,
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});