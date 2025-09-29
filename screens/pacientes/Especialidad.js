import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from '../../Src/Navegation/Services/Conexion';

export default function Especialidad() {
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchEspecialidades();
    }, []);

    const fetchEspecialidades = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert('Error', 'Debes iniciar sesión para ver las especialidades');
                return;
            }

            // 🔹 Consumimos directamente la API de especialidades
            const especialidadesResult = await api.get("/especialidades");
            const especialidadesData = especialidadesResult.data.data || [];

            setEspecialidades(especialidadesData);
        } catch (error) {
            console.error("❌ Error obteniendo especialidades:", error);
            Alert.alert('Error', 'No se pudieron obtener los datos');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEspecialidades();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando especialidades...</Text>
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
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Nuestras Especialidades</Text>
                <Text style={styles.subtitle}>
                    En nuestra clínica nos especializamos en brindar atención integral en múltiples áreas de la salud. 
                    Cada servicio está respaldado por un equipo médico profesional y comprometido con tu bienestar.
                </Text>
            </View>

            {/* CARDS */}
            <View style={styles.cardsContainer}>
                {especialidades.length > 0 ? (
                    especialidades.map((especialidad) => (
                        <View key={especialidad.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{especialidad.nombre}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No hay especialidades disponibles</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Próximamente verás aquí nuestras especialidades médicas.
                        </Text>
                    </View>
                )}
            </View>

            {/* INFO EXTRA */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>¿Por qué elegirnos?</Text>
                <Text style={styles.infoText}>
                    • Atención personalizada y cercana{'\n'}
                    • Profesionales con amplia experiencia{'\n'}
                    • Especialidades médicas variadas{'\n'}
                    • Instalaciones modernas y confortables{'\n'}
                    • Tecnología avanzada en diagnóstico
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#0ea5e9',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#e0f2fe',
        lineHeight: 22,
    },
    loadingText: {
        fontSize: 18,
        color: '#6b7280',
    },
    cardsContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginVertical: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
    infoSection: {
        padding: 20,
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
});
