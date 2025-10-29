import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../Src/Navegation/AuthContext';
import { SharedService } from '../Src/Navegation/Services/DoctorService';

export default function LogoutComponent({ navigation, style, textStyle, iconColor = "#fff" }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    console.log("🔄 LogoutComponent: Botón de cerrar sesión presionado");

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
              console.log("🔄 LogoutComponent: Iniciando proceso de logout");

              // Llamar al endpoint de logout del backend primero
              console.log("🔄 LogoutComponent: Llamando SharedService.logout()");
              const logoutResult = await SharedService.logout();
              console.log("✅ LogoutComponent: SharedService.logout() completado:", logoutResult);

              // Limpiar el contexto local después
              console.log("🔄 LogoutComponent: Limpiando contexto local");
              await logout();
              console.log("✅ LogoutComponent: Contexto local limpiado");

              console.log("✅ LogoutComponent: Sesión cerrada exitosamente");
            } catch (error) {
              console.error("❌ LogoutComponent: Error cerrando sesión:", error);
              console.error("❌ LogoutComponent: Error details:", error.response?.data || error.message);
              // Aún así, limpiar sesión local y navegar
              console.log("🔄 LogoutComponent: Limpiando contexto local por error");
              await logout();
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