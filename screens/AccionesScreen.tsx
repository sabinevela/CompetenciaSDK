import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function AccionesScreen() {
  return (
    <LinearGradient
      colors={['#FF6F00', '#FFB300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconBox}>
          <Ionicons name="leaf" size={64} color="white" />
        </View>
        <Text style={styles.title}>Acciones Sostenibles</Text>
        <Text style={styles.description}>
          Contribuye a la sostenibilidad y reduce tu huella ambiental
        </Text>
        
        <View style={styles.card}>
          <Ionicons name="bicycle" size={24} color="#00C853" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Movilidad Verde</Text>
            <Text style={styles.cardText}>Usa transporte público, camina o usa bicicleta.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="trash" size={24} color="#1976D2" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Reciclaje</Text>
            <Text style={styles.cardText}>Separa residuos y reutiliza materiales.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="water" size={24} color="#00BCD4" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ahorro de Agua</Text>
            <Text style={styles.cardText}>Usa agua eficientemente en casa y el trabajo.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="bulb" size={24} color="#FBC02D" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Energía Limpia</Text>
            <Text style={styles.cardText}>Opta por energías renovables y eficiencia energética.</Text>
          </View>
        </View>

        <View style={styles.statsBox}>
          <Text style={styles.statsTitle}>Tu Impacto</Text>
          <Text style={styles.statsValue}>0</Text>
          <Text style={styles.statsLabel}>Acciones realizadas</Text>
        </View>

        <Text style={styles.placeholder}>Próximamente: retos, recompensas y comunidad</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  content: { padding: 20, paddingBottom: 40, alignItems: 'center' },
  iconBox: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  title: { fontSize: 24, fontWeight: '800', color: 'white', marginBottom: 8, textAlign: 'center' },
  description: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 20 },
  card: { 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  cardContent: { marginLeft: 12, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: 'white', marginBottom: 4 },
  cardText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  statsBox: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 16, 
    padding: 24, 
    marginTop: 20, 
    width: '100%',
    alignItems: 'center'
  },
  statsTitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  statsValue: { fontSize: 48, fontWeight: '800', color: 'white', marginBottom: 8 },
  statsLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  placeholder: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginTop: 20 }
});
