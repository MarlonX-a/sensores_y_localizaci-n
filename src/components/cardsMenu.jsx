import { Image, StyleSheet, Text, View } from 'react-native';

export default function MenuCard({ nombre, descripcion, precio, imagen }) {
  return (
    <View style={styles.card}>
      <Image
        accessibilityLabel={nombre}
        source={{ uri: imagen }}
        style={styles.imagen}
      />

      <View style={styles.contenedorTexto}>
        <Text numberOfLines={1} style={styles.nombre}>
          {nombre}
        </Text>
        <Text numberOfLines={2} style={styles.descripcion}>
          {descripcion}
        </Text>
        <Text style={styles.precio}>{precio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  imagen: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    height: 76,
    marginRight: 12,
    width: 76,
  },
  contenedorTexto: {
    flex: 1,
  },
  nombre: {
    color: '#161111',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  descripcion: {
    color: '#5F6368',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  precio: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
