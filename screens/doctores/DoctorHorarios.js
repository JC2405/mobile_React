import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargarHorarios = async () => {
    try {
      // Aquí consumirías endpoints relacionados con horarios del doctor
      console.log("🔄 Cargando horarios del doctor");
      // const response = await DoctorService.obtenerMisHorarios();
      // setHorarios(response.data);
    } catch (error) {
      console.error("❌ Error cargando horarios:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarHorarios();
  };

  const diasSemana = [
    { id: 1, nombre: 'Lunes', activo: true, inicio: '08:00', fin: '17:00' },
    { id: 2, nombre: 'Martes', activo: true, inicio: '08:00', fin: '17:00' },
    { id: 3, nombre: 'Miércoles', activo: true, inicio: '08:00', fin: '17:00' },
    { id: 4, nombre: 'Jueves', activo: true, inicio: '08:00', fin: '17:00' },
    { id: 5, nombre: 'Viernes', activo: true, inicio: '08:00', fin: '17:00' },
    { id: 6, nombre: 'Sábado', activo: false, inicio: '08:00', fin: '12:00' },
    { id: 7, nombre: 'Domingo', activo: false, inicio: '08:00', fin: '12:00' },
  ];

  const renderDia = (dia) => (
    <View key={dia.id} style={styles.diaItem}>
      <View style={styles.diaInfo}>
        <Text style={styles.diaNombre}>{dia.nombre}</Text>
        <Text style={styles.diaHorario}>
          {dia.activo ? `${dia.inicio} - ${dia.fin}` : 'No disponible'}
        </Text>
      </View>
      <View style={[
        styles.estadoIndicador,
        { backgroundColor: dia.activo ? '#10B981' : '#EF4444' }
      ]} />
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mis Horarios</Text>
        <Text style={styles.subtitle}>Gestiona tu disponibilidad</Text>
      </View>

      <View style={styles.horariosContainer}>
        <Text style={styles.sectionTitle}>Horarios de Atención</Text>
        {diasSemana.map(renderDia)}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time" size={24} color="#fff" />
          <Text style={styles.actionText}>Modificar Horarios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Ionicons name="calendar" size={24} color="#3B82F6" />
          <Text style={[styles.actionText, styles.secondaryText]}>Ver Disponibilidad</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  horariosContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  diaItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  diaInfo: {
    flex: 1,
  },
  diaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  diaHorario: {
    fontSize: 14,
    color: '#64748b',
  },
  estadoIndicador: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#3B82F6',
  },
});