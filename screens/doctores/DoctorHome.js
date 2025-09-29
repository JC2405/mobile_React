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

export default function DoctorHome() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    citasHoy: 0,
    citasPendientes: 0,
    pacientesAtendidos: 0,
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Aquí cargarías los datos del doctor
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Panel del Doctor</Text>
        <Text style={styles.subtitle}>Bienvenido a tu área de trabajo</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={32} color="#10B981" />
          <Text style={styles.statNumber}>{stats.citasHoy}</Text>
          <Text style={styles.statLabel}>Citas Hoy</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={32} color="#F59E0B" />
          <Text style={styles.statNumber}>{stats.citasPendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={32} color="#3B82F6" />
          <Text style={styles.statNumber}>{stats.pacientesAtendidos}</Text>
          <Text style={styles.statLabel}>Atendidos</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.actionText}>Ver Citas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="clock" size={24} color="#fff" />
          <Text style={styles.actionText}>Horarios</Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
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
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});