import React, { useState, useContext } from "react";
import { loginUser } from "../../Src/Navegation/Services/AuthService";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
} from "react-native";
import TextInputComponent from "../../components/inputComponent";
import { AuthContext } from "../../Src/Navegation/AuthContext";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      console.log("🔄 Iniciando handleLogin con:", { email, password });
      const result = await loginUser(email, password);
      console.log("📊 Resultado del loginUser:", result);

      // 🔍 DEBUG: Información completa del resultado
      console.log("🔍 DEBUG - Información del usuario en login:", result.user);
      console.log("🔍 DEBUG - Rol del usuario en login:", result.user?.rol);
      console.log("🔍 DEBUG - ID del rol en login:", result.user?.idrol);

      if (result.success) {
        console.log("✅ Login exitoso, guardando token:", result.token);
        console.log("🔍 DEBUG - Antes de guardar en contexto, información del usuario:", result.user);
        await login(result.token, result.user); // ✅ guarda en contexto y AsyncStorage
        console.log("✅ Token guardado");

        // 🔍 DEBUG: Determinar navegación basada en guard (método más directo) - MOVER ANTES DE LA ALERTA
        console.log("🔍 DEBUG - Guard del usuario:", result.user?.guard);
        console.log("🔍 DEBUG - User type del usuario:", result.user?.user_type);

        // ✅ NAVEGACIÓN BASADA EN ROL_ID Y GUARD
        let navigationRoute = 'Main'; // Default para pacientes

        if (result.user) {
          console.log("🔍 DEBUG - Analizando usuario para navegación:", result.user);

          // Método 1: Verificar por rol_id (más confiable según tu estructura)
          const rolId = result.user.rol_id || result.user.idrol;
          console.log("🔍 DEBUG - rol_id detectado:", rolId);

          if (rolId === 1 || rolId === '1') {
            console.log("🔍 DEBUG - rol_id=1 (admin), navegando a AdminHome");
            navigationRoute = 'AdminHome';
          } else if (rolId === 2 || rolId === '2') {
            console.log("🔍 DEBUG - rol_id=2 (doctor), navegando a DoctorHome");
            navigationRoute = 'DoctorHome';
          } else if (rolId === 3 || rolId === '3') {
            console.log("🔍 DEBUG - rol_id=3 (paciente), navegando a Main");
            navigationRoute = 'Main';
          }

          // Método 2: Backup por guard
          else if (result.user.guard === 'api_admin') {
            console.log("🔍 DEBUG - Guard es api_admin, navegando a AdminHome");
            navigationRoute = 'AdminHome';
          } else if (result.user.guard === 'api_doctores') {
            console.log("🔍 DEBUG - Guard es api_doctores, navegando a DoctorHome");
            navigationRoute = 'DoctorHome';
          } else if (result.user.guard === 'api_usuarios') {
            console.log("🔍 DEBUG - Guard es api_usuarios, navegando a Main");
            navigationRoute = 'Main';
          }

          // Método 3: Backup por rol en texto
          else {
            const userRol = result.user.rol ? String(result.user.rol).toLowerCase() : '';
            console.log("🔍 DEBUG - Rol en texto:", userRol);

            if (userRol === 'admin') {
              console.log("🔍 DEBUG - Rol texto 'admin', navegando a AdminHome");
              navigationRoute = 'AdminHome';
            } else if (userRol === 'doctor') {
              console.log("🔍 DEBUG - Rol texto 'doctor', navegando a DoctorHome");
              navigationRoute = 'DoctorHome';
            } else if (userRol === 'paciente') {
              console.log("🔍 DEBUG - Rol texto 'paciente', navegando a Main");
              navigationRoute = 'Main';
            }
          }
        }

        console.log("✅ Mostrando alerta con navigationRoute determinado:", navigationRoute);
        Alert.alert(
          "Inicio de sesión exitoso",
          `Bienvenido - Guard: ${result.user.guard} - Type: ${result.user.user_type}`,
          [
            {
              text: "OK",
              onPress: () => {
                console.log("🔄 Usuario presionó OK, navegando a pantalla principal");
                console.log("🔍 DEBUG - Navegando a ruta:", navigationRoute);
                console.log("🔍 DEBUG - Información completa del usuario:", JSON.stringify(result.user, null, 2));
                // Navegación basada en guard
                console.log("🔍 DEBUG - ANTES de navigation.reset, navigationRoute =", navigationRoute);
                navigation.reset({
                  index: 0,
                  routes: [{ name: navigationRoute }],
                });
              }
            }
          ]
        );
        console.log("✅ Alerta mostrada");

      } else {
        console.log("❌ Login fallido:", result.message);
        Alert.alert(
          "Error al iniciar sesión",
          result.message || "Ocurrió un error al iniciar la sesión"
        );
      }
    } catch (e) {
      console.log("❌ Error inesperado en login: ", e);
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Accede a tu cuenta</Text>

        {/* Inputs */}
        <View style={styles.form}>
          <TextInputComponent
            label="Correo Electrónico"
            placeholder="ejemplo@email.com"
            value={email}
            onChangeText={setEmail}
          />
          <TextInputComponent
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log("🔘 Botón presionado con datos:", { email, password });
            handleLogin(email, password);
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿No tienes cuenta?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
          >
            Regístrate
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
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 18,
  },
  form: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
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
