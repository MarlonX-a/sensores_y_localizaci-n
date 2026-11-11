import { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function SolicitudesLocales() {
  const [db, setDb] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    let activo = true;
    async function iniciar() {
      try {
        const conexion = await SQLite.openDatabaseAsync('solicitudes.db');
        await conexion.execAsync(`
          CREATE TABLE IF NOT EXISTS solicitudes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asunto TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            sincronizado INTEGER NOT NULL DEFAULT 0
          );
        `);
        if (activo) {
          setDb(conexion);
          await cargar(conexion);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo abrir la base de datos.');
        console.error(error);
      }
    }
    iniciar();
    return () => { activo = false; };
  }, []);

  async function cargar(conexion = db) {
    if (!conexion) return;
    try {
      const filas = await conexion.getAllAsync(
        'SELECT * FROM solicitudes ORDER BY id DESC'
      );
      setSolicitudes(filas);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron leer las solicitudes.');
    }
  }

  async function guardar() {
    if (!db) return;
    if (!asunto.trim() || !descripcion.trim()) {
      Alert.alert('Validación', 'Complete asunto y descripción.');
      return;
    }
    try {
      if (editandoId === null) {
        await db.runAsync(
          'INSERT INTO solicitudes (asunto, descripcion, sincronizado) VALUES (?, ?, 0)',
          asunto.trim(), descripcion.trim()
        );
      } else {
        await db.runAsync(
          'UPDATE solicitudes SET asunto = ?, descripcion = ?, sincronizado = 0 WHERE id = ?',
          asunto.trim(), descripcion.trim(), editandoId
        );
      }
      setAsunto('');
      setDescripcion('');
      setEditandoId(null);
      await cargar();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar la solicitud.');
    }
  }

  function editar(item) {
    setEditandoId(item.id);
    setAsunto(item.asunto);
    setDescripcion(item.descripcion);
  }

  function eliminar(id) {
    Alert.alert('Eliminar solicitud', '¿Desea eliminar este registro local?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try {
          await db.runAsync('DELETE FROM solicitudes WHERE id = ?', id);
          if (editandoId === id) {
            setEditandoId(null); setAsunto(''); setDescripcion('');
          }
          await cargar();
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'No se pudo eliminar.');
        }
      }}
    ]);
  }

  const pendientes = solicitudes.filter(s => s.sincronizado === 0).length;

  return (
    <SafeAreaView style={styles.contenedor}>
      <FlatList
        style={styles.lista}
        contentContainerStyle={styles.contenidoLista}
        ListHeaderComponentStyle={styles.encabezadoLista}
        data={solicitudes}
        keyExtractor={item => String(item.id)}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={(
          <View style={styles.formulario}>
            <Text style={styles.titulo}>Solicitudes locales</Text>
            <Text style={styles.estadoPendiente}>
              Sincronización pendiente: {pendientes}
            </Text>
            <TextInput
              style={styles.campo}
              placeholder="Asunto"
              placeholderTextColor="#7A7A7A"
              value={asunto}
              onChangeText={setAsunto}
            />
            <TextInput
              style={[styles.campo, styles.campoDescripcion]}
              placeholder="Descripción"
              placeholderTextColor="#7A7A7A"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              textAlignVertical="top"
            />
            <Pressable
              style={[styles.boton, !db && styles.botonDesactivado]}
              onPress={guardar}
              disabled={!db}
              accessibilityRole="button"
            >
              <Text style={styles.botonTexto}>
                {editandoId === null ? 'Guardar solicitud' : 'Actualizar solicitud'}
              </Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>No existen solicitudes guardadas.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.negrita}>{item.asunto}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.estadoRegistro}>
              Estado: {item.sincronizado === 0 ? 'Pendiente' : 'Sincronizado'}
            </Text>
            <View style={styles.fila}>
              <Pressable onPress={() => editar(item)} accessibilityRole="button">
                <Text style={styles.accion}>Editar</Text>
              </Pressable>
              <Pressable onPress={() => eliminar(item.id)} accessibilityRole="button">
                <Text style={styles.accion}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  formulario: {
    width: '100%',
    maxWidth: 460,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    marginBottom: 8,
    color: '#161111',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  estadoPendiente: {
    marginBottom: 8,
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  campo: {
    minHeight: 45,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontSize: 15,
  },
  campoDescripcion: {
    minHeight: 88,
    paddingTop: 12,
  },
  boton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: '#007BFF',
  },
  botonDesactivado: {
    opacity: 0.6,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  lista: {
    width: '100%',
    flex: 1,
  },
  contenidoLista: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  encabezadoLista: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
  vacio: {
    paddingVertical: 24,
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  tarjeta: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  negrita: {
    marginBottom: 6,
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descripcion: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 21,
  },
  estadoRegistro: {
    marginTop: 8,
    color: '#666666',
    fontSize: 13,
  },
  fila: {
    flexDirection: 'row',
    gap: 22,
    marginTop: 12,
  },
  accion: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

