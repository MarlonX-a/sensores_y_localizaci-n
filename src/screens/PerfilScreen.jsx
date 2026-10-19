import { View, Text, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { useState }  from 'react';
import * as imagenPicker from 'expo-image-picker';
import Titulo from '../components/Titulo';

export default function PerfilScreen({ titulo, subtitulo }) {
    const [imagen, setImagen] = useState(null)
        const seleccionarImagen = async () => {
            try {
                //solicitamos el permiso para acceder las imágenes del dispositivo
                const permiso = await imagenPicker.requestMediaLibraryPermissionsAsync();
                //si el usuario no concede el permiso, detenemos la función
                if (!permiso.granted) {
                    Alert.alert(
                        'Permiso denegado',
                        'Debes permitir el acceso a la galería'
                    );
                    return;
                }
    
                //abrimos la galería del dispositivo
                const resultado = await imagenPicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    quality: 0.8,
                });
    
                //si el usuario seleccionó una imagen y no canceló la operación
                //guardamos la dirección de la URI  de la imagen
                if (!resultado.canceled) {
                    setImagen(resultado.assets[0].uri);
                }
            } catch (error) {
                //mostrar por consola
                console.log('Error al seleccionar la imagen:', error);
                Alert.alert(
                    'Error',
                    "No se pudo abrir la galeria del dispositivo"
                )
            }
        };
    const escanearQr = async () => {
      try {
        const permiso = await imagenPicker.requestCameraPermissionsAsync();
  
        if (!permiso.granted) {
          Alert.alert(
            'Acceso Denegado',
            'Debes permitir el acceso a la cámara'
          );
          return;
        }
  
        const resultado = await imagenPicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
        })
  
        if (!resultado.canceled) {
          setImagen(resultado.assets[0].uri);
        }
      } catch (error) {
        console.log(error)
        Alert.alert(
          'Error',
          'No se pudo abrir la cámara del dispositivo'
        )
      }
    }
  return (
    <View style={styles.container}>
      <Titulo text={titulo} subtitulo={subtitulo} />
      <View style={styles.tarjeta}>

        <View style={styles.fotoPerfil}>
          {imagen ? (
            <Image
              source={{ uri: imagen }}
              style={styles.imagenPerfil}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.textoFotoPerfil}>MA</Text>
          )}
        </View>

        <Text style={styles.etiquetas}>Nombre: </Text>
        <Text style={styles.texto}>Wadrid M</Text>
        <Text style={styles.etiquetas}>Correo: </Text>
        <Text style={styles.texto}>jair.DP@gmail.com</Text>
        <Text style={styles.etiquetas}>Teléfono: </Text>
        <Text style={styles.texto}>7777777-888</Text>

        <Pressable 
          style={styles.boton}
          onPress={escanearQr}
        >
          <Text style={styles.textoBoton}>Cambiar foto de perfil</Text>
        </Pressable>
        <Pressable 
          style={styles.boton}
          onPress={seleccionarImagen}
        >
          <Text style={styles.textoBoton}>Seleccionar foto de perfil</Text>
        </Pressable>
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  tarjeta: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4, 
    elevation: 3,
  },
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#dfe7f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#c7d2e3',
  },
  imagenPerfil: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  textoFotoPerfil: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b4a5a',
  },
  etiquetas: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  boton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})