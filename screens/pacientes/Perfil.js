import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from '../../Src/Navegation/AuthContext';
import api from '../../Src/Navegation/Services/Conexion';

export default function Perfil() {
    const { userToken } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState(null);
    const [epsData, setEpsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, [userToken]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            console.log('🔄 Obteniendo perfil del usuario...');

            // Check if user is authenticated
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                console.log('❌ No token found - user needs to login first');
                Alert.alert('Error', 'Debes iniciar sesión para ver tu perfil');
                return;
            }

            // Get user profile from /me endpoint
            const response = await api.get('/me');
            console.log('📊 Perfil de usuario obtenido:', response.data);

            if (response.data && response.data.success) {
                setUserProfile(response.data.user);
                console.log('✅ Perfil cargado exitosamente');

                // Fetch EPS data if user has eps_id
                if (response.data.user.eps_id) {
                    await fetchEpsData(response.data.user.eps_id);
                }
            } else {
                console.error('❌ Error en respuesta del perfil:', response.data);
                Alert.alert('Error', 'No se pudo obtener la información del perfil');
            }

        } catch (error) {
            console.error('❌ Error al obtener perfil:', error);
            console.error('❌ Error response:', error.response);
            Alert.alert('Error', 'No se pudo cargar la información del perfil');
        } finally {
            setLoading(false);
        }
    };

    const fetchEpsData = async (epsId) => {
        try {
            console.log('🔄 Obteniendo datos de EPS:', epsId);
            const response = await api.get(`/eps/${epsId}`);
            console.log('📊 Datos de EPS obtenidos:', response.data);

            if (response.data) {
                setEpsData(response.data);
                console.log('✅ EPS cargada:', response.data.nombre);
            }
        } catch (error) {
            console.error('❌ Error al obtener EPS:', error);
            setEpsData(null);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserProfile();
        setRefreshing(false);
    };

    const getUserTypeLabel = (userType) => {
        switch (userType) {
            case 'admin': return 'Administrador';
            case 'doctor': return 'Médico';
            case 'paciente': return 'Paciente';
            default: return 'Usuario';
        }
    };

    const getUserTypeColor = (userType) => {
        switch (userType) {
            case 'admin': return '#DC2626'; // Red
            case 'doctor': return '#059669'; // Green
            case 'paciente': return '#4F46E5'; // Blue
            default: return '#6B7280'; // Gray
        }
    };

    const renderProfileInfo = () => {
        if (!userProfile) return null;

        return (
            <View style={styles.profileContainer}>
                {/* Header Card */}
                <View style={[styles.headerCard, { backgroundColor: getUserTypeColor(userProfile.user_type) }]}>
                    <Text style={styles.userType}>{getUserTypeLabel(userProfile.user_type)}</Text>
                    <Text style={styles.userName}>{userProfile.name}</Text>
                    <Text style={styles.userEmail}>{userProfile.email}</Text>
                </View>

                {/* Details Card */}
                <View style={styles.detailsCard}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Tipo de Usuario:</Text>
                        <Text style={[styles.value, { color: getUserTypeColor(userProfile.user_type) }]}>
                            {getUserTypeLabel(userProfile.user_type)}
                        </Text>
                    </View>

                    {/* Doctor-specific information */}
                    {userProfile.user_type === 'doctor' && (
                        <>
                            {userProfile.apellido && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Apellido:</Text>
                                    <Text style={styles.value}>{userProfile.apellido}</Text>
                                </View>
                            )}
                            {userProfile.telefono && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Teléfono:</Text>
                                    <Text style={styles.value}>{userProfile.telefono}</Text>
                                </View>
                            )}
                            {userProfile.especialidad_id && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>ID Especialidad:</Text>
                                    <Text style={styles.value}>{userProfile.especialidad_id}</Text>
                                </View>
                            )}
                            {userProfile.cubiculo_id && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>ID Cubículo:</Text>
                                    <Text style={styles.value}>{userProfile.cubiculo_id}</Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* Patient-specific information */}
                    {userProfile.user_type === 'paciente' && (
                        <>
                            {userProfile.apellido && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Apellido:</Text>
                                    <Text style={styles.value}>{userProfile.apellido}</Text>
                                </View>
                            )}
                            {userProfile.telefono && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Teléfono:</Text>
                                    <Text style={styles.value}>{userProfile.telefono}</Text>
                                </View>
                            )}
                            {userProfile.direccion && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Dirección:</Text>
                                    <Text style={styles.value}>{userProfile.direccion}</Text>
                                </View>
                            )}
                            {userProfile.eps_id && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>EPS:</Text>
                                    <Text style={styles.value}>
                                        {epsData ? epsData.nombre : `EPS ${userProfile.eps_id}`}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* Role information */}
                    {userProfile.rol && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Rol:</Text>
                            <Text style={styles.value}>{userProfile.rol.role || userProfile.rol}</Text>
                        </View>
                    )}
                    {userProfile.rol_id && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>ID Rol:</Text>
                            <Text style={styles.value}>{userProfile.rol_id}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.title}>Mi Perfil</Text>
                <Text style={styles.subtitle}>Información personal y de cuenta</Text>
            </View>

            {renderProfileInfo()}

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Información de la Cuenta</Text>
                <Text style={styles.infoText}>
                    • Esta información se obtiene directamente de tu cuenta{'\n'}
                    • Desliza hacia abajo para actualizar{'\n'}
                    • Los datos se sincronizan con el servidor
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    loadingText: {
        fontSize: 18,
        color: '#6b7280',
    },
    profileContainer: {
        padding: 16,
    },
    headerCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    userType: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 8,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    detailsCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    label: {
        fontSize: 16,
        color: '#4b5563',
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
    infoSection: {
        padding: 20,
        marginTop: 10,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
});

