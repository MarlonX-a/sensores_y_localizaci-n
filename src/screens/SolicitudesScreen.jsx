import { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import SensorMovimiento from '../components/SensorMovimiento';
import Titulo from '../components/Titulo';
import { guardarSolicitudEnBackend } from '../services/solicitudesApi';

const TEXTO_MOVIMIENTO = 'Movimiento detectado: requiere atención en mesa.';

export default function SolicitudesScreen() {
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [consultandoUbicacion, setConsultandoUbicacion] = useState(false);
  const [guardandoSolicitud, setGuardandoSolicitud] = useState(false);

  const seleccionarImagen = async () => {
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permiso.granted) {
        Alert.alert('Permiso denegado', 'Debes permitir el acceso a la galería.');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!resultado.canceled) setImagen(resultado.assets[0].uri);
    } catch (error) {
      console.log('Error al seleccionar la imagen:', error);
      Alert.alert('Error', 'No se pudo abrir la galería del dispositivo.');
    }
  };

  const tomarFoto = async () => {
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync();
      if (!permiso.granted) {
        Alert.alert('Permiso denegado', 'Debes permitir el acceso a la cámara.');
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      if (!resultado.canceled) setImagen(resultado.assets[0].uri);
    } catch (error) {
      console.log('Error al tomar la foto:', error);
      Alert.alert('Error', 'No se pudo abrir la cámara del dispositivo.');
    }
  };

  const obtenerUbicacion = async () => {
    try {
      setConsultandoUbicacion(true);
      const permiso = await Location.requestForegroundPermissionsAsync();
      if (permiso.status !== 'granted') {
        Alert.alert('Permiso requerido', 'Autoriza el acceso a tu ubicación para continuar.');
        return;
      }

      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUbicacion({
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
        precision: posicion.coords.accuracy,
      });
    } catch (error) {
      console.log('Error al obtener la ubicación:', error);
      Alert.alert('Ubicación no disponible', 'No se pudo obtener la ubicación actual.');
    } finally {
      setConsultandoUbicacion(false);
    }
  };

  const marcarAtencionEnMesa = () => {
    setAsunto((actual) => actual || 'Atención en mesa');
    setDescripcion((actual) => (
      actual.includes(TEXTO_MOVIMIENTO)
        ? actual
        : [actual, TEXTO_MOVIMIENTO].filter(Boolean).join('\n')
    ));
  };

  const registrarSolicitud = async () => {
    if (!asunto.trim() || !descripcion.trim()) {
      Alert.alert('Datos incompletos', 'Escribe el asunto y la descripción de la solicitud.');
      return;
    }

    setGuardandoSolicitud(true);
    try {
      const solicitud = await guardarSolicitudEnBackend({
        asunto,
        descripcion,
        imagen,
        ubicacion,
      });

      setAsunto('');
      setDescripcion('');
      setImagen(null);
      setUbicacion(null);

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Solicitud registrada',
            body: 'Tu solicitud se guardó correctamente.',
            data: { tipo: 'solicitud_creada', solicitudId: solicitud.id },
          },
          trigger: null,
        });
        Alert.alert('Solicitud registrada', 'Se guardó correctamente.');
      } catch (errorNotificacion) {
        console.warn('La solicitud se guardó, pero falló la notificación local:', errorNotificacion);
        Alert.alert(
          'Solicitud registrada',
          'El servidor guardó la solicitud, pero no se pudo mostrar la notificación. Revisa los permisos de notificaciones.',
        );
      }
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      Alert.alert('No se pudo registrar', mensaje);
    } finally {
      setGuardandoSolicitud(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Titulo
        text="Nueva solicitud"
        subtitulo="Completa los datos para crear una nueva solicitud"
      />

      <TextInput
        accessibilityLabel="Asunto de la solicitud"
        placeholder="Asunto"
        value={asunto}
        onChangeText={setAsunto}
        style={styles.input}
      />
      <TextInput
        accessibilityLabel="Descripción de la solicitud"
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, styles.areaTexto]}
        multiline
        textAlignVertical="top"
      />

      <Pressable onPress={seleccionarImagen} style={styles.boton} accessibilityRole="button">
        <Text style={styles.textoBoton}>Seleccionar imagen</Text>
      </Pressable>
      <Pressable onPress={tomarFoto} style={styles.boton} accessibilityRole="button">
        <Text style={styles.textoBoton}>Tomar foto</Text>
      </Pressable>
      <Pressable
        onPress={obtenerUbicacion}
        disabled={consultandoUbicacion}
        style={[styles.boton, consultandoUbicacion && styles.botonDesactivado]}
        accessibilityRole="button"
      >
        <Text style={styles.textoBoton}>
          {consultandoUbicacion ? 'Consultando ubicación…' : 'Obtener ubicación'}
        </Text>
      </Pressable>

      <Pressable
        onPress={registrarSolicitud}
        disabled={guardandoSolicitud}
        style={[styles.boton, guardandoSolicitud && styles.botonDesactivado]}
        accessibilityRole="button"
      >
        {guardandoSolicitud ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.textoBoton}>Registrar solicitud</Text>
        )}
      </Pressable>

      {ubicacion && (
        <View style={styles.tarjetaDato}>
          <Text style={styles.textoDato}>Latitud: {ubicacion.latitud.toFixed(6)}</Text>
          <Text style={styles.textoDato}>Longitud: {ubicacion.longitud.toFixed(6)}</Text>
          <Text style={styles.textoDato}>
            Precisión aproximada: {ubicacion.precision == null
              ? 'No disponible'
              : `${Math.round(ubicacion.precision)} m`}
          </Text>
        </View>
      )}

      {imagen && (
        <View style={styles.vistaImagen}>
          <Text style={styles.textoDato}>Imagen seleccionada:</Text>
          <Image source={{ uri: imagen }} style={styles.imagen} resizeMode="cover" />
        </View>
      )}

      <SensorMovimiento onMovimientoDetectado={marcarAtencionEnMesa} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenido: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
  },
  input: {
    width: '85%',
    minHeight: 45,
    marginBottom: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  areaTexto: {
    minHeight: 90,
    paddingTop: 12,
  },
  boton: {
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#007BFF',
  },
  botonDesactivado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tarjetaDato: {
    width: '85%',
    marginBottom: 14,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  textoDato: {
    marginBottom: 4,
    color: '#444444',
    fontSize: 13,
  },
  vistaImagen: {
    width: '85%',
    marginBottom: 14,
  },
  imagen: {
    width: '100%',
    height: 180,
    marginTop: 6,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
});
