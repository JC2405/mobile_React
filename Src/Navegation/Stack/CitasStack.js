import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Citas from '../../../screens/pacientes/Citas';


const Stack = createNativeStackNavigator();

export function CitasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Citas" component={Citas} />
    </Stack.Navigator>
  );
}