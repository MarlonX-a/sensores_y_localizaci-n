import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Titulo from '../components/Titulo';

export default function InicioScreen({ titulo, subtitulo }) {
  const [imagen, setImagen] = useState(null);

  const tomarFoto = async () => {
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync();
      if (!permiso.granted) {
        Alert.alert('Acceso denegado', 'Debes permitir el acceso a la cámara.');
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      if (!resultado.canceled) setImagen(resultado.assets[0].uri);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo abrir la cámara del dispositivo.');
    }
  };

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

  return (
    <ScrollView
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      <Titulo text={titulo} subtitulo={subtitulo} />

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>SABOR DE LA COSTA</Text>
        <Image
          source={imagen ? { uri: imagen } : require('../../assets/hero.jpeg')}
          style={styles.imagen}
          resizeMode="cover"
          accessibilityLabel="Foto principal de PICAMONTE"
        />
        <Text style={styles.tituloFoto}>Hecho con cariño</Text>
        <Text style={styles.descripcion}>
          Disfruta la auténtica comida costeña, preparada con ese sabor que se siente como en casa.
        </Text>

        <Text style={styles.subtituloAccion}>Personaliza la foto</Text>
        <View style={styles.filaBotones}>
          <Pressable style={styles.boton} onPress={tomarFoto} accessibilityRole="button">
            <Text style={styles.textoBoton}>Tomar foto</Text>
          </Pressable>
          <Pressable style={styles.boton} onPress={seleccionarImagen} accessibilityRole="button">
            <Text style={styles.textoBoton}>Elegir de galería</Text>
          </Pressable>
        </View>

        <Text style={styles.subtituloAccion}>¿Cómo quieres disfrutarlo?</Text>
        <View style={styles.filaBotones}>
          <Pressable style={[styles.boton, styles.botonPrincipal]} accessibilityRole="button">
            <Text style={styles.textoBotonPrincipal}>Pedir a domicilio</Text>
          </Pressable>
          <Pressable
            style={[styles.boton, styles.botonPrincipal]}
            onPress={tomarFoto}
            accessibilityRole="button"
          >
            <Text style={styles.textoBotonPrincipal}>Pedir al local</Text>
          </Pressable>
        </View>
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
    alignSelf: 'flex-start',
    color: '#666666',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  imagen: {
    width: '100%',
    height: 190,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
  tituloFoto: {
    color: '#222222',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 6,
  },
  descripcion: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 21,
  },
  subtituloAccion: {
    color: '#333333',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 10,
  },
  filaBotones: {
    flexDirection: 'row',
    gap: 10,
  },
  boton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  textoBoton: {
    color: '#444444',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  botonPrincipal: {
    borderColor: '#007BFF',
    backgroundColor: '#007BFF',
  },
  textoBotonPrincipal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
