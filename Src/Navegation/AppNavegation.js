import { NavigationContainer } from "@react-navigation/native";
import MainNavegation from "./MainNavigation";
import AuthNavegation from "./AuthNavegation";
import React, { useContext } from "react";
import { AuthContext, AuthProvider } from "./AuthContext";

function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return null; // aquí puedes poner un SplashScreen si quieres
  }

  return (
    <NavigationContainer>
      {userToken ? <MainNavegation /> : <AuthNavegation />}
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
