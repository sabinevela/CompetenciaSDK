import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function EducacionScreen() {
  return (
    <LinearGradient
      colors={['#00C853', '#00E676']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconBox}>
          <Ionicons name="school" size={64} color="white" />
        </View>
        <Text style={styles.title}>Educación Climática</Text>
        <Text style={styles.description}>
          Aprende sobre cambio climático, volcanes y riesgos naturales en Ecuador
        </Text>
        
        <View style={styles.card}>
          <Ionicons name="leaf" size={24} color="#00C853" />
          <Text style={styles.cardTitle}>Cambio Climático</Text>
          <Text style={styles.cardText}>Entiende el impacto del cambio climático en nuestro país.</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="alert-circle" size={24} color="#FF6F00" />
          <Text style={styles.cardTitle}>Volcanes Activos</Text>
          <Text style={styles.cardText}>Conoce la actividad volcánica y cómo prepararse.</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="water" size={24} color="#1976D2" />
          <Text style={styles.cardTitle}>Inundaciones</Text>
          <Text style={styles.cardText}>Prevención y acciones durante lluvias intensas.</Text>
        </View>

        <Text style={styles.placeholder}>Próximamente: artículos, videos y quizzes educativos</Text>
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
  cardTitle: { fontSize: 16, fontWeight: '700', color: 'white', marginLeft: 12, marginBottom: 4 },
  cardText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginLeft: 12 },
  placeholder: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginTop: 20 }
});
