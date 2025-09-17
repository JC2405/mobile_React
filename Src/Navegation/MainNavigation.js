import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';
import MainStack from './Stack/MainStack';
import { CitasStack } from './Stack/CitasStack';
import { EspecialidadesStack } from './Stack/EspecialidadStack';
import { AgendarStack } from './Stack/AgendarStack';
import { PerfilStack } from './Stack/PerfilStack';


const Tab = createBottomTabNavigator();

export default function MainNavegation() {
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
        name="Inicio"
        component={MainStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
          tabBarLabel: 'Inicio',
        }}
      />

    

      <Tab.Screen
        name="Citas"
        component={CitasStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
          tabBarLabel: 'Citas',
        }}
      />

        <Tab.Screen
        name="Agendar"
        component={AgendarStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="share" size={size} color={color} />
          ),
          tabBarLabel: 'Agendar',
        }}
      />

        <Tab.Screen
        name="Especialidades"
        component={EspecialidadesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="star" size={size} color={color} />
          ),
          tabBarLabel: 'Especialidades',
        }}
      />


          <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="cloud" size={size} color={color} />
          ),
          tabBarLabel: 'Perfil',
        }}
      />

      
    </Tab.Navigator>



  );
}
