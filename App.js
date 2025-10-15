import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as Notifications from 'expo-notifications';
import AppNavegation from "./Src/Navegation/AppNavegation";

export default function App() {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotifications: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const getPermisos = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requieren permisos para recibir notificaciones');
      }
    };

    getPermisos();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <AppNavegation />
    </>
  );
}
