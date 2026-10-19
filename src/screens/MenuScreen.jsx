import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMemo, useState } from 'react';

import MenuCard from '../components/cardsMenu';
import Titulo from '../components/Titulo';

const MENU_ITEMS = [
  {
    id: 'encebollado',
    nombre: 'Encebollado',
    descripcion: 'Pescado, yuca, cebolla encurtida y chifle.',
    precio: '$3.50',
    imagen: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'corviche',
    nombre: 'Corviche',
    descripcion: 'Masa de plátano verde rellena de pescado.',
    precio: '$2.00',
    imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ceviche',
    nombre: 'Ceviche de camarón',
    descripcion: 'Camarones en salsa cítrica con cebolla y tomate.',
    precio: '$5.00',
    imagen: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tigrillo',
    nombre: 'Tigrillo',
    descripcion: 'Verde majado con queso, huevo y café.',
    precio: '$3.00',
    imagen: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=300&q=80',
  },
];

export default function MenuScreen({ titulo, subtitulo }) {
  const [busqueda, setBusqueda] = useState('');

  const productosFiltrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase();

    if (!consulta) {
      return MENU_ITEMS;
    }

    return MENU_ITEMS.filter(({ nombre, descripcion }) =>
      `${nombre} ${descripcion}`.toLocaleLowerCase().includes(consulta),
    );
  }, [busqueda]);

  return (
    <View style={styles.container}>
      <Titulo text={titulo} subtitulo={subtitulo} />

      <TextInput
        accessibilityLabel="Buscar en el menú"
        autoCapitalize="none"
        clearButtonMode="while-editing"
        onChangeText={setBusqueda}
        placeholder="Buscar un plato..."
        placeholderTextColor="#7A7A7A"
        style={styles.buscar}
        value={busqueda}
      />

      <FlatList
        contentContainerStyle={styles.lista}
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.sinResultados}>
            No encontramos platos con ese nombre.
          </Text>
        }
        renderItem={({ item }) => <MenuCard {...item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 28,
    width: '100%',
  },
  buscar: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  lista: {
    paddingBottom: 16,
  },
  sinResultados: {
    color: '#666666',
    fontSize: 16,
    paddingTop: 32,
    textAlign: 'center',
  },
});
