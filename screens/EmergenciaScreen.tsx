import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function EmergenciaScreen() {
  return (
    <LinearGradient
      colors={['#D32F2F', '#F44336']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconBox}>
          <Ionicons name="medical" size={64} color="white" />
        </View>
        <Text style={styles.title}>Plan de Emergencia</Text>
        <Text style={styles.description}>
          Prepárate y conoce qué hacer ante desastres naturales
        </Text>
        
        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Kit de Emergencia</Text>
            <Text style={styles.cardText}>Agua, linterna, botiquín, radio y documentos.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="map" size={24} color="#2196F3" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ruta de Evacuación</Text>
            <Text style={styles.cardText}>Identifica zonas seguras y rutas de salida.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="call" size={24} color="#FF9800" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Contactos de Emergencia</Text>
            <Text style={styles.cardText}>Bomberos: 911 | Cruz Roja: 131</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="home" size={24} color="#9C27B0" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>En Casa</Text>
            <Text style={styles.cardText}>Asegura muebles, identifica refugios internos.</Text>
          </View>
        </View>

        <Text style={styles.placeholder}>Próximamente: checklists interactivos y simulacros</Text>
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
  placeholder: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginTop: 20 }
});
