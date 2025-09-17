import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Perfil from '../../../screens/pacientes/Perfil';


const Stack = createNativeStackNavigator();

export function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={Perfil} />
    </Stack.Navigator>
  );
}