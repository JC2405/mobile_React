import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { AuthContext } from '../../Src/Navegation/AuthContext';
import DashboardCard from '../../components/DashboardCard';
import { obtenerCitasPorPaciente, obtenerEspecialidades } from '../../Src/Navegation/Services/CitasService';
import api from '../../Src/Navegation/Services/Conexion';

export default function Home() {
  const { userToken } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [userToken]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userResponse = await api.get('/me');
      if (userResponse.data && userResponse.data.id) {
        setUserId(userResponse.data.id);
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
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Bienvenido de vuelta 👋</Text>
      </View>

      <View style={styles.cardsContainer}>
        {citas.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Mis Citas</Text>
            {citas.map((cita, index) => (
              <DashboardCard
                key={cita.id}
                title={`Cita #${index + 1}`}
                count={index + 1}
                icon="📅"
                backgroundColor="#4F46E5"
                onPress={() =>
                  Alert.alert(
                    `Cita #${index + 1}`,
                    `Fecha: ${new Date(cita.fecha_hora).toLocaleDateString()}\nEstado: ${cita.estado}`
                  )
                }
                subtitle={new Date(cita.fecha_hora).toLocaleDateString()}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tienes citas registradas</Text>
            <Text style={styles.emptyStateSubtext}>Las citas que agendes aparecerán aquí</Text>
          </View>
        )}

        <DashboardCard
          title="Ver Especialidades"
          count={especialidades.length} // 👈 ahora mostrará el número real
          icon="🏥"
          backgroundColor="#059669"
          onPress={() =>
            Alert.alert(
              'Especialidades',
              `Hay ${especialidades.length} especialidades disponibles. Ve a la pantalla de Especialidades para ver los detalles.`
            )
          }
          subtitle="Toca para ver detalles"
        />
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
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280' },
  loadingText: { fontSize: 18, color: '#6b7280' },
  cardsContainer: { padding: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 10,
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginVertical: 20 },
  emptyStateText: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  infoSection: { padding: 20, marginTop: 10 },
  infoTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 },
  infoText: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
});
