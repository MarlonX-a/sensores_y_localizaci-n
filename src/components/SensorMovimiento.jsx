import { useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const INTERVALO_MS = 200;
const UMBRAL_MOVIMIENTO = 0.65;

export default function SensorMovimiento({ onMovimientoDetectado }) {
  const [activo, setActivo] = useState(false);
  const [estado, setEstado] = useState('Sensor apagado');
  const [intensidad, setIntensidad] = useState(0);
  const yaDetecto = useRef(false);
  const callbackRef = useRef(onMovimientoDetectado);

  useEffect(() => {
    callbackRef.current = onMovimientoDetectado;
  }, [onMovimientoDetectado]);

  useEffect(() => {
    if (!activo) return undefined;

    Accelerometer.setUpdateInterval(INTERVALO_MS);
    const suscripcion = Accelerometer.addListener(({ x, y, z }) => {
      const magnitud = Math.sqrt(x * x + y * y + z * z);
      const cambio = Math.abs(magnitud - 1);
      setIntensidad(cambio);

      if (cambio >= UMBRAL_MOVIMIENTO && !yaDetecto.current) {
        yaDetecto.current = true;
        setEstado('Movimiento detectado. Solicitud marcada para atención en mesa.');
        callbackRef.current?.();
      }
    });

    return () => suscripcion.remove();
  }, [activo]);

  const alternarSensor = async () => {
    if (activo) {
      setActivo(false);
      setEstado('Sensor apagado');
      yaDetecto.current = false;
      return;
    }

    try {
      if (Platform.OS === 'web') {
        const permiso = await Accelerometer.requestPermissionsAsync();
        if (!permiso.granted) {
          setEstado('Debes permitir el acceso al sensor de movimiento.');
          return;
        }
      }

      const disponible = await Accelerometer.isAvailableAsync();
      if (!disponible) {
        setEstado('El sensor no está disponible en este dispositivo.');
        return;
      }

      yaDetecto.current = false;
      setIntensidad(0);
      setEstado('Mueve el teléfono para marcar la solicitud.');
      setActivo(true);
    } catch (error) {
      console.log('Error al iniciar el sensor de movimiento:', error);
      setEstado('No se pudo iniciar el sensor.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Sensor de movimiento</Text>
      <Text style={styles.estado}>{estado}</Text>
      {activo && (
        <Text style={styles.intensidad}>
          Movimiento: {intensidad.toFixed(2)} g
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        onPress={alternarSensor}
        style={[styles.boton, activo && styles.botonActivo]}
      >
        <Text style={styles.textoBoton}>
          {activo ? 'Detener sensor' : 'Activar sensor'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '85%',
    marginBottom: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  titulo: {
    marginBottom: 4,
    color: '#333333',
    fontSize: 15,
    fontWeight: 'bold',
  },
  estado: {
    marginBottom: 8,
    color: '#666666',
    fontSize: 13,
  },
  intensidad: {
    marginBottom: 8,
    color: '#666666',
    fontSize: 12,
  },
  boton: {
    alignSelf: 'flex-start',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  botonActivo: {
    backgroundColor: '#555555',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
