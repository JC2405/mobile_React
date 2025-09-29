import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [userToken, setUserToken] = useState(null);
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     // Verificar si hay un token guardado al iniciar la app
     const checkToken = async () => {
       try {
         console.log("🔍 DEBUG - AuthContext: Verificando token guardado al iniciar app");
         const token = await AsyncStorage.getItem('userToken');
         const userData = await AsyncStorage.getItem('userData');

         console.log("🔍 DEBUG - AuthContext: Token encontrado:", token ? "SÍ" : "NO");
         console.log("🔍 DEBUG - AuthContext: UserData encontrado:", userData ? "SÍ" : "NO");

         if (token) {
           setUserToken(token);
           console.log("🔍 DEBUG - AuthContext: Token establecido en estado");
         }
         if (userData) {
           const parsedUser = JSON.parse(userData);
           setUser(parsedUser);
           console.log("🔍 DEBUG - AuthContext: Usuario establecido en estado:", parsedUser);
           console.log("🔍 DEBUG - AuthContext: Rol del usuario guardado:", parsedUser?.rol);
         }
       } catch (error) {
         console.error('Error al verificar token guardado:', error);
       } finally {
         setIsLoading(false);
         console.log("🔍 DEBUG - AuthContext: Finalizó carga inicial");
       }
     };

     checkToken();
   }, []);

  const login = async (token, userData = null) => {
     try {
       console.log("🔍 DEBUG - AuthContext login - token:", token);
       console.log("🔍 DEBUG - AuthContext login - userData:", JSON.stringify(userData, null, 2));

       await AsyncStorage.setItem('userToken', token);
       setUserToken(token);

       if (userData) {
         console.log("🔍 DEBUG - AuthContext guardando userData:", userData);
         console.log("🔍 DEBUG - AuthContext - Guard recibido:", userData.guard);
         console.log("🔍 DEBUG - AuthContext - User type recibido:", userData.user_type);

         await AsyncStorage.setItem('userData', JSON.stringify(userData));
         setUser(userData);
       }
     } catch (error) {
       console.error('Error al guardar token:', error);
     }
   };

  const logout = async () => {
     try {
       await AsyncStorage.removeItem('userToken');
       await AsyncStorage.removeItem('userData');
       setUserToken(null);
       setUser(null);
     } catch (error) {
       console.error('Error al eliminar token:', error);
     }
   };

  // Función auxiliar para obtener información del usuario
  const getUserInfo = () => {
     if (!user) return null;

     return {
        isAdmin: user.guard === 'api_admin' || user.user_type === 'admin',
        isDoctor: user.guard === 'api_doctores' || user.user_type === 'doctor',
        isPaciente: user.guard === 'api_usuarios' || user.user_type === 'paciente',
        guard: user.guard,
        userType: user.user_type,
        role: user.rol,
        roleId: user.rol_id
     };
  };

  const value = {
     userToken,
     user,
     isLoading,
     login,
     logout,
     getUserInfo,
   };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};