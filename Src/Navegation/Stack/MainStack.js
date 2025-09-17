import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Home from '../../../screens/pacientes/Home';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#f7f6f6ff',
          headerTitleAlign: 'center',
          // 👇 Customizamos el headerTitle
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  color: '#f7f6f6ff',
                  fontWeight: 'bold',
                  fontSize: 20,
                  fontFamily: 'sans-serif-condensed',
                  marginRight: 6, // espacio entre el texto y el icono
                }}
              >
                Inicio
              </Text>
              <Ionicons name="heart" size={22} color="#f7f6f6ff" />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
