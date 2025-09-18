import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import api from "../../Src/Services/Conexion";

export default function Perfil() {
    const navigation = useNavigation();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");

                if (!token) {
                    Alert.alert(
                        "No se encontró el token de usuario",
                        "Redirigiendo al login",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate('Login'),
                            },
                        ]
                    );
                    return;
                }

                const response = await api.get("/me");
                setUsuario(response.data);
            } catch (error) {
                console.log("Error al cargar el perfil:", error);
                if (error.isAuthError || error.shouldRedirectToLogin) {
                    console.log(
                        "Error de autenticación manejado por el interceptor, redirigiendo al login",
                    );
                    navigation.navigate('Login');
                    return;
                }

                if (error.response) {
                    Alert.alert(
                        "Error del servidor",
                        `Error ${error.response.status}: ${error.response.data?.message || "Ocurrió un error al cargar el perfil"}`,
                        [
                            {
                                text: "OK",
                                onPress: async () => {
                                    await AsyncStorage.removeItem("userToken");
                                    navigation.navigate('Login');
                                },
                            },
                        ],
                    );
                } else if (error.request) {
                    Alert.alert("Error de conexión", "No se pudo conectar a internet, verifica tu conexión", [
                        {
                            text: "OK",
                            onPress: async () => {
                                await AsyncStorage.removeItem("userToken");
                                navigation.navigate('Login');
                            },
                        },
                    ]);
                } else {
                    Alert.alert(
                        "Error de conexión",
                        "Ocurrió un error inesperado al cargar el perfil",
                        [
                            {
                                text: "OK",
                                onPress: async () => {
                                    await AsyncStorage.removeItem("userToken");
                                    navigation.navigate('Login');
                                },
                            },
                        ],
                    );
                }
            } finally {
                setLoading(false);
            }
        };
        cargarPerfil();
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem("userToken");
                        navigation.navigate('Login');
                    },
                },
            ]
        );
    };

    const handleEditProfile = () => {
        // Placeholder for edit functionality
        Alert.alert("Editar perfil", "Funcionalidad de edición próximamente");
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true)}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Perfil del Usuario</Text>
            </View>

            <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {usuario.name ? usuario.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Nombre:</Text>
                        <Text style={styles.value}>{usuario.name || 'No disponible'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Correo:</Text>
                        <Text style={styles.value}>{usuario.email || 'No disponible'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Rol:</Text>
                        <Text style={styles.value}>{usuario.rol || 'No disponible'}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#64748B',
    },
    errorText: {
        fontSize: 18,
        color: '#EF4444',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    infoContainer: {
        marginTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        width: 80,
    },
    value: {
        fontSize: 16,
        color: '#6B7280',
        flex: 1,
    },
    buttonContainer: {
        padding: 16,
    },
    editButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});