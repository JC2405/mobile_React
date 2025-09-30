import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../Src/Navegation/AuthContext';
import { DoctorService } from '../../Src/Navegation/Services/DoctorService';

export default function DoctorHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const cargarHorarios = async () => {
    try {
      console.log("🔄 Cargando horarios del doctor");
      const response = await DoctorService.obtenerMisHorarios();

      if (response.success) {
        console.log("✅ Horarios cargados exitosamente:", response.data.horarios?.length || 0);
        setHorarios(response.data.horarios || []);
      } else {
        console.error("❌ Error en respuesta:", response.message);
        Alert.alert("Error", response.message || "Error al cargar horarios");
      }
    } catch (error) {
      console.error("❌ Error cargando horarios:", error);
      Alert.alert("Error", "Error al cargar los horarios");
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

  const modificarHorarios = () => {
    Alert.alert(
      "Modificar Horarios",
      "Funcionalidad de modificación de horarios próximamente disponible.",
      [{ text: "OK" }]
    );
  };

  const verDisponibilidad = () => {
    const diasActivos = getDiasSemana().filter(dia => dia.activo);
    const mensaje = diasActivos.length > 0
      ? `Tienes ${diasActivos.length} días configurados:\n\n${diasActivos.map(dia => `${dia.nombre}: ${dia.inicio} - ${dia.fin}`).join('\n')}`
      : "No tienes días configurados para atención.";

    Alert.alert(
      "Disponibilidad Actual",
      mensaje,
      [{ text: "OK" }]
    );
  };

  // Mapear números de día a nombres
  const diasMap = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo'
  };

  // Crear estructura de días con datos reales
  const getDiasSemana = () => {
    const diasBase = [1, 2, 3, 4, 5, 6, 7]; // Lunes a Domingo
    return diasBase.map(diaNum => {
      const horario = horarios.find(h => parseInt(h.dia) === diaNum);
      return {
        id: diaNum,
        nombre: diasMap[diaNum],
        activo: horario ? horario.estado === 'activo' : false,
        inicio: horario ? horario.hora_inicio : '08:00',
        fin: horario ? horario.hora_fin : '17:00',
        horarioId: horario ? horario.id : null
      };
    });
  };

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
        {getDiasSemana().map(renderDia)}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={modificarHorarios}>
          <Ionicons name="time" size={24} color="#fff" />
          <Text style={styles.actionText}>Modificar Horarios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={verDisponibilidad}>
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