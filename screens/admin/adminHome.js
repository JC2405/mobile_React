import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LogoutComponent from '../../components/LogoutComponent';
import {
  AdminUsuariosService,
  AdminDoctoresService,
  AdminEspecialidadesService,
  AdminCitasService,
  AdminEPSService,
  AdminCubiculosService,
  AdminHorariosService
} from '../../Src/Navegation/Services/AdminService';

export default function AdminHome({ navigation }) {
  const [estadisticas, setEstadisticas] = useState({
    usuarios: 0,
    doctores: 0,
    especialidades: 0,
    citas: 0,
    eps: 0,
    cubiculos: 0,
    horarios: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Función para cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      console.log("🔄 AdminHome: Cargando estadísticas del dashboard");

      // Ejecutar todas las consultas en paralelo
      const [usuariosRes, doctoresRes, especialidadesRes, citasRes, epsRes, cubiculosRes, horariosRes] = await Promise.all([
        AdminUsuariosService.listarUsuarios(),
        AdminDoctoresService.listarDoctores(),
        AdminEspecialidadesService.listarEspecialidades(),
        AdminCitasService.listarCitas(),
        AdminEPSService.listarEPSActivas(),
        AdminCubiculosService.listarCubiculos(),
        AdminHorariosService.listarHorarios()
      ]);

      // Actualizar estadísticas
      setEstadisticas({
        usuarios: usuariosRes.success ? usuariosRes.data.length : 0,
        doctores: doctoresRes.success ? doctoresRes.data.length : 0,
        especialidades: especialidadesRes.success ? especialidadesRes.data.length : 0,
        citas: citasRes.success ? citasRes.data.length : 0,
        eps: epsRes.success ? epsRes.data.length : 0,
        cubiculos: cubiculosRes.success ? cubiculosRes.data.length : 0,
        horarios: horariosRes.success ? horariosRes.data.length : 0
      });

      console.log("✅ AdminHome: Estadísticas cargadas exitosamente");
    } catch (error) {
      console.error("❌ AdminHome: Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    cargarEstadisticas();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    cargarEstadisticas();
  };

  // Tarjeta de estadística
  const EstadisticaCard = ({ titulo, valor, icono, color, onPress }) => (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icono} size={24} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardValor}>{valor}</Text>
          <Text style={styles.cardTitulo}>{titulo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Gestión completa del sistema</Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.estadisticasContainer}>
        <View style={styles.estadisticasRow}>
          <EstadisticaCard
            titulo="Usuarios"
            valor={estadisticas.usuarios}
            icono="people"
            color="#3B82F6"
            onPress={() => navigation.navigate('AdminUsuarios')}
          />

          <EstadisticaCard
            titulo="Doctores"
            valor={estadisticas.doctores}
            icono="medical"
            color="#10B981"
            onPress={() => navigation.navigate('AdminDoctores')}
          />
        </View>

        <View style={styles.estadisticasRow}>
          <EstadisticaCard
            titulo="Especialidades"
            valor={estadisticas.especialidades}
            icono="school"
            color="#F59E0B"
            onPress={() => navigation.navigate('AdminEspecialidades')}
          />

          <EstadisticaCard
            titulo="Citas"
            valor={estadisticas.citas}
            icono="calendar"
            color="#EF4444"
            onPress={() => navigation.navigate('AdminCitas')}
          />
        </View>

        <View style={styles.estadisticasRow}>
          <EstadisticaCard
            titulo="EPS"
            valor={estadisticas.eps}
            icono="business"
            color="#8B5CF6"
            onPress={() => navigation.navigate('AdminEPS')}
          />

          <EstadisticaCard
            titulo="Cubículos"
            valor={estadisticas.cubiculos}
            icono="home"
            color="#06B6D4"
            onPress={() => navigation.navigate('AdminCubiculos')}
          />
        </View>

        <View style={styles.estadisticasRow}>
          <EstadisticaCard
            titulo="Horarios"
            valor={estadisticas.horarios}
            icono="time"
            color="#EC4899"
            onPress={() => navigation.navigate('AdminHorarios')}
          />

          <View style={styles.estadisticasPlaceholder} />
        </View>
      </View>

      {/* Acciones rápidas */}
      <View style={styles.accionesContainer}>
        <Text style={styles.seccionTitulo}>Acciones Rápidas</Text>

        <TouchableOpacity
          style={styles.accionButton}
          onPress={() => navigation.navigate('AdminUsuarios')}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.accionButtonText}>Crear Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accionButton}
          onPress={() => navigation.navigate('AdminDoctores')}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.accionButtonText}>Crear Doctor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.accionButton}
          onPress={() => navigation.navigate('AdminEspecialidades')}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.accionButtonText}>Crear Especialidad</Text>
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  estadisticasContainer: {
    padding: 20,
  },
  estadisticasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  estadisticasPlaceholder: {
    width: '48%',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  cardValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cardTitulo: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  accionesContainer: {
    padding: 20,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  accionButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  accionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});