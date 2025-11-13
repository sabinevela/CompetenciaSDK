import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function MapaScreen() {
  return (
    <LinearGradient
      colors={['#00BCD4', '#00E5FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="map" size={64} color="white" />
        </View>
        <Text style={styles.title}>Mapa de Riesgos</Text>
        <Text style={styles.description}>
          Visualiza zonas con alertas climatológicas y volcánicas en tiempo real
        </Text>
        <Text style={styles.placeholder}>Próximamente: integración con Mapbox</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  content: { alignItems: 'center' },
  iconBox: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { fontSize: 28, fontWeight: '800', color: 'white', marginBottom: 10, textAlign: 'center' },
  description: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 20 },
  placeholder: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }
});
