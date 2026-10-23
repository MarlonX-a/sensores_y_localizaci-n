import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import Titulo from '../components/Titulo';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificacionesPush() {
  const [token, setToken] = useState('');
  const [ultimoAviso, setUltimoAviso] = useState('Sin notificaciones');
  const [estado, setEstado] = useState('Pendiente');

  useEffect(() => {
    const recibida = Notifications.addNotificationReceivedListener((notificacion) => {
      setUltimoAviso(
        notificacion.request.content.title || 'Notificación recibida',
      );
    });

    const pulsada = Notifications.addNotificationResponseReceivedListener((respuesta) => {
      console.log(
        'Datos al pulsar:',
        respuesta.notification.request.content.data,
      );
    });

    return () => {
      recibida.remove();
      pulsada.remove();
    };
  }, []);

  async function registrarDispositivo() {
    try {
      if (!Device.isDevice) {
        setEstado('La prueba push requiere un dispositivo Android físico.');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Avisos de solicitudes',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      const permisoActual = await Notifications.getPermissionsAsync();
      let concedido = permisoActual.granted;

      if (!concedido) {
        const permisoSolicitado = await Notifications.requestPermissionsAsync();
        concedido = permisoSolicitado.granted;
      }

      if (!concedido) {
        setEstado('Permiso denegado. Revisa los ajustes del teléfono.');
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        throw new Error('No se encontró el projectId de EAS.');
      }

      const resultado = await Notifications.getExpoPushTokenAsync({ projectId });

      setToken(resultado.data);
      setEstado('Token obtenido correctamente.');
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      setEstado(`Error: ${mensaje}`);
      Alert.alert('Registro fallido', mensaje);
    }
  }

  async function probarNotificacionLocal() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Solicitud registrada',
          body: 'Tu solicitud fue registrada correctamente.',
          data: { pantalla: 'solicitudes', tipo: 'registro' },
        },
        trigger: null,
      });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      Alert.alert('Error en la notificación local', mensaje);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      <Titulo
        text="Notificaciones"
        subtitulo="Administra los permisos y prueba los avisos de tu dispositivo"
      />

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Estado</Text>
        <Text style={styles.texto}>{estado}</Text>

        <Pressable
          style={styles.boton}
          onPress={registrarDispositivo}
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>Solicitar permisos y obtener token</Text>
        </Pressable>

        <Text style={styles.etiqueta}>Expo Push Token</Text>
        <View style={styles.tarjetaToken}>
          <Text selectable style={styles.token}>
            {token || 'Aún no disponible'}
          </Text>
        </View>

        <Pressable
          style={styles.boton}
          onPress={probarNotificacionLocal}
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>Probar notificación local</Text>
        </Pressable>

        <Text style={styles.etiqueta}>Último aviso</Text>
        <Text style={styles.texto}>{ultimoAviso}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenido: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  etiqueta: {
    color: '#333333',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 6,
  },
  texto: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 21,
  },
  tarjetaToken: {
    minHeight: 48,
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#F9F9F9',
  },
  token: {
    color: '#444444',
    fontSize: 12,
    lineHeight: 18,
  },
  boton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#007BFF',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
