import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';
import DoctorHome from './DoctorHome';
import DoctorCitas from './DoctorCitas';
import DoctorPerfil from './DoctorPerfil';
import DoctorHorarios from './DoctorHorarios';

const Tab = createBottomTabNavigator();

export default function DoctorNavigation() {
  console.log("🔍 DEBUG - ========== DoctorNavigation ==========");
  console.log("🔍 DEBUG - DoctorNavigation: Renderizando navegación de DOCTOR");

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 1,
          borderTopColor: '#1E293B',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#ffffffff',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="DoctorHome"
        component={DoctorHome}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical" color={color} size={size} />
          ),
          tabBarLabel: 'Inicio',
        }}
      />

      <Tab.Screen
        name="DoctorCitas"
        component={DoctorCitas}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
          tabBarLabel: 'Mis Citas',
        }}
      />

      <Tab.Screen
        name="DoctorHorarios"
        component={DoctorHorarios}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
          tabBarLabel: 'Horarios',
        }}
      />

      <Tab.Screen
        name="DoctorPerfil"
        component={DoctorPerfil}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}