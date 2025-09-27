import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Citas from '../../../screens/pacientes/Citas';
import CrearCita from '../../../screens/pacientes/CrearCita';

const Stack = createNativeStackNavigator();

export function CitasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Citas"
        component={Citas}
        options={{ title: 'Mis Citas' }}
      />
      <Stack.Screen
        name="CrearCita"
        component={CrearCita}
        options={{ title: 'Agendar Cita' }}
      />
    </Stack.Navigator>
  );
}