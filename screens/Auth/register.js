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
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [telefono, setTelefono] = useState("");
    const [documentoIdentidad, setDocumentoIdentidad] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");

    const handleRegister = async () => {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        return;
      }
      if (!nombre || !apellido || !email || !password || !documentoIdentidad || !fechaNacimiento) {
        Alert.alert("Error", "Todos los campos obligatorios deben ser completados");
        return;
      }
      
      // Validate password length
      if (password.length < 8) {
        Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres");
        return;
      }
      
      // Validate date format (basic validation)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(fechaNacimiento)) {
        Alert.alert("Error", "La fecha debe estar en formato YYYY-MM-DD (ej: 1990-01-15)");
        return;
      }
      
      const userData = {
        nombre,
        apellido,
        email,
        password,
        telefono: telefono || null, // Send null if empty
        documento_identidad: documentoIdentidad,
        fecha_nacimiento: fechaNacimiento,
        eps_id: 1, // Default to first EPS (SURA)
        rol_id: 3 // ID 3 is for 'paciente' role
      };
      
      const result = await registerUser(userData);
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
              label="Nombre *"
              placeholder="Ej: Juan"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInputComponent
              label="Apellido *"
              placeholder="Ej: Pérez"
              value={apellido}
              onChangeText={setApellido}
            />
            <TextInputComponent
              label="Documento de Identidad *"
              placeholder="Ej: 12345678"
              value={documentoIdentidad}
              onChangeText={setDocumentoIdentidad}
            />
            <TextInputComponent
              label="Correo Electrónico *"
              placeholder="ejemplo@email.com"
              value={email}
              onChangeText={setEmail}
            />
            <TextInputComponent
              label="Teléfono"
              placeholder="Ej: 3001234567"
              value={telefono}
              onChangeText={setTelefono}
            />
            <TextInputComponent
              label="Fecha de Nacimiento *"
              placeholder="YYYY-MM-DD"
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
            />
            <TextInputComponent
              label="Contraseña *"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInputComponent
              label="Confirmar Contraseña *"
              placeholder="Repita la contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
  },
  link: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

