import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Agendar from '../../../screens/pacientes/Agendar';


const Stack = createNativeStackNavigator();


export function AgendarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Agendar" component={Agendar} />
    </Stack.Navigator>
  );
}