  import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
    View,
  } from "react-native";
  import TextInputComponent from "../../components/inputComponent";

  export default function Register({ navigation }) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Tarjeta central */}
        <View style={styles.card}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para continuar</Text>

          {/* Inputs */}
          <View style={styles.form}>
            {TextInputComponent("Nombre Completo", "Ej: Juan Pérez")}
            {TextInputComponent("Correo Electrónico", "ejemplo@email.com")}
            {TextInputComponent("Contraseña", "Mínimo 6 caracteres")}
            {TextInputComponent("Confirmar Contraseña", "Repita la contraseña")}
          </View>

          {/* Botón */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => Alert.alert("Cuenta creada", "Registro exitoso")}
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
      backgroundColor: "#E2E8F0",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    card: {
      width: "100%",
      maxWidth: 380,
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: "#1E293B",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 15,
      color: "#64748B",
      marginBottom: 16,
    },
    form: {
      width: "100%",
      marginBottom: 18,
    },
    button: {
      backgroundColor: "#2563EB",
      paddingVertical: 14,
      borderRadius: 12,
      width: "100%",
      alignItems: "center",
      marginBottom: 14,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    footerText: {
      fontSize: 14,
      color: "#475569",
      textAlign: "center",
    },
    link: {
      color: "#2563EB",
      fontWeight: "600",
    },
  });
