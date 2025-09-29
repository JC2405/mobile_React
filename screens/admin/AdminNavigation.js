import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';
import AdminHome from './adminHome';
import AdminUsuarios from './AdminUsuarios';
import AdminDoctores from './AdminDoctores';
import AdminEspecialidades from './AdminEspecialidades';
import AdminCitas from './AdminCitas';
import AdminEPS from './AdminEPS';
import AdminCubiculos from './AdminCubiculos';
import AdminHorarios from './AdminHorarios';

const Tab = createBottomTabNavigator();

export default function AdminNavigation() {
  console.log("🔍 DEBUG - ========== AdminNavigation ==========");
  console.log("🔍 DEBUG - AdminNavigation: Renderizando navegación de ADMINISTRADOR");

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
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#ffffffff',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHome}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarLabel: 'ADMIN Inicio',
        }}
      />

      <Tab.Screen
        name="AdminUsuarios"
        component={AdminUsuarios}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
          tabBarLabel: 'ADMIN Usuarios',
        }}
      />

      <Tab.Screen
        name="AdminDoctores"
        component={AdminDoctores}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user-check" size={size} color={color} />
          ),
          tabBarLabel: 'Doctores',
        }}
      />

      <Tab.Screen
        name="AdminEspecialidades"
        component={AdminEspecialidades}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="star" size={size} color={color} />
          ),
          tabBarLabel: 'Especialidades',
        }}
      />

      <Tab.Screen
        name="AdminCitas"
        component={AdminCitas}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
          tabBarLabel: 'Citas',
        }}
      />

      <Tab.Screen
        name="AdminEPS"
        component={AdminEPS}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="briefcase" size={size} color={color} />
          ),
          tabBarLabel: 'EPS',
        }}
      />

      <Tab.Screen
        name="AdminCubiculos"
        component={AdminCubiculos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Cubículos',
        }}
      />

      <Tab.Screen
        name="AdminHorarios"
        component={AdminHorarios}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
          tabBarLabel: 'Horarios',
        }}
      />
    </Tab.Navigator>
  );
}