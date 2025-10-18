import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../Src/Navegation/AuthContext';
import { SharedService } from '../Src/Navegation/Services/DoctorService';

export default function LogoutComponent({ navigation, style, textStyle, iconColor = "#fff" }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🔄 LogoutComponent: Cerrando sesión");
              
              // Llamar al endpoint de logout del backend
              await SharedService.logout();
              
              // Limpiar el contexto local
              await logout();
              
              console.log("✅ LogoutComponent: Sesión cerrada exitosamente");
              
              // Navegar al login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error("❌ LogoutComponent: Error cerrando sesión:", error);
              // Aún así, limpiar sesión local
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.logoutButton, style]} 
      onPress={handleLogout}
    >
      <Ionicons name="log-out-outline" size={20} color={iconColor} />
      <Text style={[styles.logoutText, textStyle]}>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});