import { NavigationContainer } from "@react-navigation/native";
import MainNavegation from "./MainNavigation";
import AuthNavegation from "./AuthNavegation";
import AdminNavigation from "../../screens/admin/AdminNavigation";
import React, { useContext } from "react";
import { AuthContext, AuthProvider } from "./AuthContext";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

// Componente de loading para mostrar mientras se verifica el token
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2563EB" />
    <Text style={styles.loadingText}>Cargando...</Text>
  </View>
);

function AppNavigator() {
   const { userToken, user, isLoading } = useContext(AuthContext);

   if (isLoading) {
     return <LoadingScreen />;
   }

   // 🔍 DEBUG: Información del usuario y navegación
   console.log("🔍 DEBUG - AppNavigator - userToken:", userToken);
   console.log("🔍 DEBUG - AppNavigator - user:", user);
   console.log("🔍 DEBUG - AppNavigator - user completo:", JSON.stringify(user, null, 2));
   console.log("🔍 DEBUG - AppNavigator - tipo de user.rol:", typeof user?.rol);
   console.log("🔍 DEBUG - AppNavigator - valor de user.rol:", user?.rol);
   console.log("🔍 DEBUG - AppNavigator - tipo de user.idrol:", typeof user?.idrol);
   console.log("🔍 DEBUG - AppNavigator - valor de user.idrol:", user?.idrol);

   // Verificar si el usuario tiene algún campo de rol
   if (user) {
     console.log("🔍 DEBUG - Campos disponibles en user:", Object.keys(user));
     console.log("🔍 DEBUG - user.rol existe:", 'rol' in user);
     console.log("🔍 DEBUG - user.idrol existe:", 'idrol' in user);
     console.log("🔍 DEBUG - user.user_type:", user.user_type);
     console.log("🔍 DEBUG - user.guard:", user.guard);
   }

   // Determinar navegación basada en guard (lógica más directa y simple)
   const getNavigationComponent = () => {
     try {
       console.log("🔍 DEBUG - ========== DETERMINANDO NAVEGACIÓN ==========");
       console.log("🔍 DEBUG - Usuario completo:", JSON.stringify(user, null, 2));

       // Verificar si el usuario existe
       if (!user) {
         console.log("❌ DEBUG - Usuario no encontrado, mostrando navegación de paciente");
         return <MainNavegation />;
       }

       // ✅ NAVEGACIÓN BASADA EN GUARD (MÉTODO MÁS DIRECTO)
       console.log("🔍 DEBUG - Guard del usuario:", user.guard);

       if (user.guard === 'api_admin') {
         console.log("✅ DEBUG - Guard es api_admin, mostrando navegación administrativa");
         return <AdminNavigation />;
       } else if (user.guard === 'api_doctores') {
         console.log("✅ DEBUG - Guard es api_doctores, mostrando navegación de doctores");
         return <MainNavegation />; // Por ahora usar Main, después crear navegación específica
       } else if (user.guard === 'api_usuarios') {
         console.log("✅ DEBUG - Guard es api_usuarios, mostrando navegación de paciente");
         return <MainNavegation />;
       }

       // ✅ VERIFICACIÓN ADICIONAL POR USER_TYPE (backup)
       console.log("🔍 DEBUG - User type del usuario:", user.user_type);
       if (user.user_type === 'admin') {
         console.log("✅ DEBUG - User type es admin, mostrando navegación administrativa");
         return <AdminNavigation />;
       }

       // ✅ VERIFICACIÓN POR ROL (método tradicional como backup)
       const isAdmin = checkIfUserIsAdmin(user);
       if (isAdmin) {
         console.log("✅ DEBUG - Usuario es admin por verificación tradicional");
         return <AdminNavigation />;
       }

       // Default para pacientes
       console.log("❌ DEBUG - Usuario es PACIENTE por defecto, mostrando navegación de paciente");
       return <MainNavegation />;

     } catch (error) {
       console.error("❌ DEBUG - Error en getNavigationComponent:", error);
       console.log("❌ DEBUG - Mostrando navegación de paciente por error");
       return <MainNavegation />;
     }
   };

   // Función auxiliar para verificar si el usuario es admin
   const checkIfUserIsAdmin = (userData) => {
     console.log("🔍 DEBUG - ========== VERIFICANDO SI ES ADMIN ==========");

     if (!userData) {
       console.log("❌ DEBUG - No hay datos de usuario");
       return false;
     }

     // Verificar diferentes campos y formatos
     const posiblesCamposRol = ['rol', 'idrol', 'role', 'role_id', 'tipo', 'type'];

     for (const campo of posiblesCamposRol) {
       if (userData[campo] !== undefined && userData[campo] !== null) {
         const valor = userData[campo];
         console.log(`🔍 DEBUG - Campo ${campo}:`, valor, `(tipo: ${typeof valor})`);

         // Verificar diferentes valores que podrían indicar admin
         if (valor === 'admin' || valor === 'Admin' || valor === 'ADMIN') {
           console.log(`✅ DEBUG - Usuario es admin (campo ${campo} = '${valor}')`);
           return true;
         }

         if (valor === 1 || valor === '1') {
           console.log(`✅ DEBUG - Usuario es admin (campo ${campo} = ${valor})`);
           return true;
         }

         if (typeof valor === 'string' && valor.toLowerCase() === 'admin') {
           console.log(`✅ DEBUG - Usuario es admin (campo ${campo} = '${valor}' convertido a minúsculas)`);
           return true;
         }

         // Verificar también campos anidados (ej: si rol es un objeto)
         if (typeof valor === 'object' && valor !== null) {
           console.log(`🔍 DEBUG - Campo ${campo} es un objeto, verificando propiedades internas`);
           if (valor.role === 'admin' || valor.rol === 'admin') {
             console.log(`✅ DEBUG - Usuario es admin (campo ${campo}.role/rol = 'admin')`);
             return true;
           }
           if (valor.role === 1 || valor.rol === 1) {
             console.log(`✅ DEBUG - Usuario es admin (campo ${campo}.role/rol = 1)`);
             return true;
           }
         }
       }
     }

     console.log("❌ DEBUG - Usuario NO es admin");
     return false;
   };

   return (
     <NavigationContainer>
       {userToken ? getNavigationComponent() : <AuthNavegation />}
     </NavigationContainer>
   );
 }

export default function AppNavegation() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
});
