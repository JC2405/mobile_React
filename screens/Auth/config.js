import { useEffect, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import * as Notificaciones from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "@mui/material";

export default function Configuracion(){
    
    const [ permisoNotificaciones, setPermisoNotificaciones] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkPermisos = async ()=>{
        const {status} = await Notificaciones.getPermissionsAsync();
        const preferencia = await AsyncStorage.getItem('notificaciones_activas');
        setPermisoNotificaciones(status === 'granted' && preferencia === 'true');
    }

    useEffect(()=>{
        checkPermisos();
    },[]);


    useFocusEffect(
        React.useCallback(() => {
            checkPermisos();
        }, [])
    );

    const toggleSwitch = async (valor) => {
        if (valor) {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                await AsyncStorage.setItem('notificaciones_activas', 'true');
                setPermisoNotificaciones(true);
            } else {
                await AsyncStorage.setItem('notificaciones_activas', 'false');
            }
        } else {
            await AsyncStorage.setItem('notificaciones_activas', 'false');
            setPermisoNotificaciones(false);
            Alert.alert('Notificaciones desactivadas');
        }
    }

    const programarNotificaciones = async () => {
        const { status } = await Notificaciones.getPermissionsAsync();
        const preferencia = await AsyncStorage.getItem('notificaciones_activas');
        if (status !== 'granted' || preferencia !== 'true') {
            Alert.alert("No tienes permisos para recibir notificaciones");
            return;
        }
        const trigger = new Date(Date.now() + 2 * 60 * 1000);

        try {
            await Notificaciones.scheduleNotificationsAsync({
                content: {
                    title: 'Notificación Programada',
                    body: 'Esta es una notificación programada para 2 minutos después'
                },
                trigger,
            });
            Alert.alert("Notificación programada para 2 minutos después");
        } catch (e) {
            Alert.alert("Error al programar la notificación");
        }
    }



    return(
        <View style={{flex:1, justifyContent:"center", alignContent:'center'}}>
            <Text style={{fontSize:18,marginBottom:10}}>
                Notificaciones:{permisoNotificaciones ? 'Activadas':'Desactivadas'}
            </Text>
            <Switch value={permisoNotificaciones} onValueChange={toggleSwitch}/>
            <Button title="Programación en 2 minutos" onPress={programarNotificaciones} />
        </View>
    )
}