import { StyleSheet, Text, View } from 'react-native';

export default function Titulo({text,subtitulo})
{
    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>{text}</Text>
            {subtitulo && (
                <Text style={styles.subtitulo}>{subtitulo}</Text>
            )}
        </View>

    );
}

const styles = StyleSheet.create({
     container: {
        marginBottom: 16,
     },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        paddingHorizontal: 20,
        color: '#161111',
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: 'normal',
        marginBottom: 8,
        textAlign: 'center',
        paddingHorizontal: 20,
        color: '#666',
    },
});
