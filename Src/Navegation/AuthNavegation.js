import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "../../screens/Auth/login";
import Register from "../../screens/Auth/register";
import AdminNavigation from "../../screens/admin/AdminNavigation";
import DoctorNavigation from "../../screens/doctores/DoctorNavigation";
import MainNavegation from "./MainNavigation";

const Stack = createNativeStackNavigator();

export default function AuthNavegation() {
  return (
    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login"
        component={Login}
         options={{title: 'Iniciar sesión', headerShown: false}} />

         <Stack.Screen name="Register"
         component={Register}
         options={{title: 'Crear cuenta'}}
         />

         {/* Rutas para navegación basada en roles */}
         
         {/* Navegación para PACIENTES */}
         <Stack.Screen name="Main"
         component={MainNavegation}
         options={{headerShown: false}}
         />

         {/* Navegación para ADMINISTRADORES */}
         <Stack.Screen name="AdminHome"
         component={AdminNavigation}
         options={{headerShown: false}}
         />

         {/* Navegación para DOCTORES */}
         <Stack.Screen name="DoctorHome"
         component={DoctorNavigation}
         options={{headerShown: false}}
         />

    </Stack.Navigator>
  );
}