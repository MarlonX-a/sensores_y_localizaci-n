import { Pressable, StyleSheet, Text, View } from "react-native";
export default function MenuInferior({ pantallaActual, setPantallaActual }){
    return(
        <View style={styles.barraMenu}>
            <Pressable style={styles.opcion} onPress={() => setPantallaActual('inicio')}>
                <Text
                    style = { pantallaActual === 'inicio'
                        ? styles.activo
                        : styles.texto
                    }
                >
                    Inicio
                </Text>
            </Pressable>
            <Pressable style={styles.opcion} onPress={() => setPantallaActual('menu')}>
                <Text
                    style = { pantallaActual === 'menu'
                        ? styles.activo
                        : styles.texto
                    }
                >
                    Menú
                </Text>
            </Pressable>
            <Pressable style={styles.opcion} onPress={() => setPantallaActual('perfil')}>
                <Text
                    style = { pantallaActual === 'perfil'
                        ? styles.activo
                        : styles.texto
                    }
                >
                    Perfil
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    barraMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingVertical: 10,
        width: '100%'
    },
    opcion: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activo: {
        backgroundColor: '#007bff',
        fontWeight: 'bold',
        fontSize: 14
    },
    texto: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 14,
    }
})
