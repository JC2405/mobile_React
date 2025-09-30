import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../Src/Navegation/AuthContext';
import DashboardCard from '../../components/DashboardCard';
import { obtenerCitasPorPaciente, obtenerEspecialidades } from '../../Src/Navegation/Services/CitasService';
import api from '../../Src/Navegation/Services/Conexion';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const { userToken } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [userToken]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userResponse = await api.get('/me');
      if (userResponse.data && userResponse.data.id) {
        setUserId(userResponse.data.id);
        setUserData(userResponse.data);
        await fetchDashboardData(userResponse.data.id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'No se pudo obtener la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (patientId) => {
    try {
      console.log('🔄 Fetching dashboard data for patient:', patientId);

      const appointmentResult = await obtenerCitasPorPaciente(patientId);
      if (appointmentResult.success) {
        setCitas(appointmentResult.citas || []);
      } else {
        setCitas([]);
      }

      const specialtyResult = await api.get("/especialidades");
      if (specialtyResult.data && specialtyResult.data.data) {
        console.log('📊 Especialidades obtenidas:', specialtyResult.data.data.length);
        setEspecialidades(specialtyResult.data.data || []);
      } else {
        setEspecialidades([]);
      }
      
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      Alert.alert('Error', 'No se pudo obtener los datos del dashboard');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) {
      await fetchDashboardData(userId);
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeIcon}>
            <Ionicons name="heart" size={40} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>
              {userData ? `${userData.nombre} ${userData.apellido}` : 'Usuario'}
            </Text>
          </View>
        </View>
        <View style={styles.headerDecoration}>
          <Ionicons name="medical" size={24} color="rgba(255,255,255,0.3)" />
        </View>
      </View>

      <View style={styles.cardsContainer}>
       

        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#10B981' }]} onPress={() => Alert.alert('Especialidades', `Hay ${especialidades.length} especialidades disponibles.`)}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="medkit" size={24} color="#fff" />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Especialidades</Text>
            <Text style={styles.quickActionSubtitle}>{especialidades.length} disponibles</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#3B82F6' }]} onPress={() => Alert.alert('Agendar Cita', 'Funcionalidad próximamente.')}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="add-circle" size={24} color="#fff" />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Nueva Cita</Text>
            <Text style={styles.quickActionSubtitle}>Agenda tu consulta</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Información Rápida</Text>
        <Text style={styles.infoText}>
          • Toca las tarjetas para ver más detalles{'\n'}
          • Desliza hacia abajo para actualizar{'\n'}
          • Gestiona tus citas desde el menú principal
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#667eea',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 18, color: '#fff', fontWeight: '600' },
  headerDecoration: {
    position: 'absolute',
    top: 80,
    right: 30,
    opacity: 0.3,
  },
  loadingText: { fontSize: 18, color: '#6b7280' },
  cardsContainer: { padding: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 10,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  appointmentSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  appointmentSpecialty: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginVertical: 20 },
  emptyStateText: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  quickActionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  infoSection: { padding: 20, marginTop: 10 },
  infoTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 },
  infoText: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
});
