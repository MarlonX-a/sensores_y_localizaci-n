import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


//importar las screens construidas
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import SolicitudesScreen from './src/screens/SolicitudesScreen';
import InicioScreen from './src/screens/InicioScreen';
import { useState } from 'react';

import MenuInferior from './src/components/MenuInferior';



export default function App() {
  const [ usuarioAutenticado, setUsuarioAutenticado ] = useState(false);
  const [ pantallaActual, setPantallaActual ] = useState('inicio');

  //si no ha iniciado sesion, muestre el login
  if (!usuarioAutenticado) {
    return (
      <View style={styles.pantallas}>
        <LoginScreen onLogin={() => setUsuarioAutenticado(true)} />
      </View>
    )
  }

  //determinar qué pantalla debe mostrar la app

  let pantalla;
  if (pantallaActual === 'menu') {
    //pantalla = <MenuScreen titulo="Menú" subtitulo="Servicio Abierto" />;
    pantalla = <SolicitudesScreen/>;
  }
  else if (pantallaActual === 'perfil') {
    //pantalla = <PerfilScreen titulo="Perfil" subtitulo="Información del usuario" />;
    pantalla = <PerfilScreen titulo="Perfil" subtitulo="Aquí puedes ver tu información y modificarla" />;
  }
  else {
    pantalla = <InicioScreen titulo="Bienvenido a PICAMONTE" subtitulo="Sabor costeño y hecho con cariño" />;
  }
  

  return (
    <View style={styles.pantallas}>
      <View style={styles.contenidoCentral}>
        {pantalla}
      </View>
      <MenuInferior pantallaActual={pantallaActual} setPantallaActual={setPantallaActual} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  pantallas: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contenidoCentral: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})