import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
} from "react-native";
import TextInputComponent from "../../components/inputComponent";
import { registerUser } from "../../Src/Navegation/Services/AuthService";

  export default function Register({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState("paciente");
      

    const handleRegister = async () => {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        return;
      }
      if (!name || !email || !password ) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }
      const result = await registerUser(name, email, password);
      if (result.success) {
        Alert.alert("Éxito", result.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", result.message);
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Tarjeta central */}
        <View style={styles.card}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para continuar</Text>

          {/* Inputs */}
          <View style={styles.form}>
            <TextInputComponent
              label="Nombre Completo"
              placeholder="Ej: Juan Pérez"
              value={name}
              onChangeText={setName}
            />
            <TextInputComponent
              label="Correo Electrónico"
              placeholder="ejemplo@email.com"
              value={email}
              onChangeText={setEmail}
            />
            <TextInputComponent
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInputComponent
              label="Confirmar Contraseña"
              placeholder="Repita la contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TextInputComponent
              label="Rol"
              placeholder="Ej: admin, user"
              value={rol}
              onChangeText={setRol}
            />
          </View>

          {/* Botón */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Registrarme</Text>
          </TouchableOpacity>

          {/* Link */}
          <Text style={styles.footerText}>
            ¿Ya tienes cuenta?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
            >
              Inicia sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    );
  }

