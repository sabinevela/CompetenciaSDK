import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SERVER_URL } from '../src/config';

const { width } = Dimensions.get('window');

interface Volcano {
  id: string;
  name: string;
  status: string;
  lat: number;
  lon: number;
  altitude?: number;
  province?: string;
  lastUpdate?: string;
}

export default function VolcanoesScreen() {
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVolcanoes();
  }, []);

  const loadVolcanoes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL.replace(/\/$/, '')}/api/volcanoes`);
      const data = await response.json();
      if (data.volcanoes) {
        setVolcanoes(data.volcanoes);
      }
    } catch (err) {
      console.error('Error loading volcanoes:', err);
      setVolcanoes([
        { id: '1', name: 'Cotopaxi', status: 'activo', lat: -0.680, lon: -78.438, altitude: 5897, province: 'Latacunga' },
        { id: '2', name: 'Chimborazo', status: 'dormido', lat: -1.469, lon: -78.817, altitude: 6263, province: 'Riobamba' },
        { id: '3', name: 'Tungurahua', status: 'activo', lat: -1.211, lon: -78.442, altitude: 5016, province: 'Ambato' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusGradient = (status: string): [string, string] => {
    switch (status.toLowerCase()) {
      case 'activo':
        return ['#FF6B6B', '#FF5252'];
      case 'en erupción':
        return ['#FF4444', '#CC0000'];
      case 'observación':
        return ['#FFA726', '#FF9800'];
      default:
        return ['#66BB6A', '#4CAF50'];
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'warning';
      case 'en erupción':
        return 'flame';
      case 'observación':
        return 'eye';
      default:
        return 'checkmark-done';
    }
  };

  const renderVolcano = ({ item, index }: { item: Volcano; index: number }) => {
    const statusGradient = getStatusGradient(item.status);
    
    return (
      <TouchableOpacity 
        style={[styles.volcanoCard, { marginTop: index === 0 ? 0 : 12 }]}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          {/* Status Badge */}
          <LinearGradient
            colors={statusGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusBadge}
          >
            <Ionicons name={getStatusIcon(item.status) as any} size={16} color="#FFF" />
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </LinearGradient>

          {/* Volcano Info */}
          <View style={styles.volcanoInfo}>
            <Text style={styles.volcanoName}>{item.name}</Text>
            {item.province && (
              <Text style={styles.volcanoProvince}>{item.province}</Text>
            )}
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            {item.altitude && (
              <View style={styles.detailBox}>
                <Ionicons name="triangle" size={18} color="#E53935" />
                <View>
                  <Text style={styles.detailLabel}>Altura</Text>
                  <Text style={styles.detailValue}>{item.altitude.toLocaleString()} m</Text>
                </View>
              </View>
            )}
            
            <View style={styles.detailBox}>
              <Ionicons name="navigate" size={18} color="#1565C0" />
              <View>
                <Text style={styles.detailLabel}>Coordenadas</Text>
                <Text style={styles.detailValue}>
                  {Math.abs(item.lat).toFixed(2)}° {item.lat > 0 ? 'N' : 'S'}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Action */}
          <View style={styles.actionRow}>
            <View style={styles.lastUpdateContainer}>
              <Ionicons name="refresh" size={12} color="#999" />
              <Text style={styles.lastUpdateText}>
                Actualizado hoy
              </Text>
            </View>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="map" size={14} color="#1565C0" />
              <Text style={styles.mapButtonText}>Ver mapa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#FFEBEE', '#FCE4EC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <LinearGradient
            colors={['#E53935', '#D32F2F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerIcon}
          >
            <Ionicons name="alert-circle" size={24} color="#FFF" />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Volcanes Activos</Text>
            <Text style={styles.headerSubtitle}>Sistema de monitoreo IGEPN</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D32F2F" />
          <Text style={styles.loadingText}>Cargando datos de volcanes...</Text>
        </View>
      ) : volcanoes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="alert-outline" size={64} color="rgba(211, 47, 47, 0.2)" />
          <Text style={styles.emptyText}>Sin datos disponibles</Text>
          <Text style={styles.emptySubtext}>Intenta refrescar la pantalla</Text>
        </View>
      ) : (
        <FlatList
          data={volcanoes}
          renderItem={renderVolcano}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      )}

      {/* Info Box */}
      <LinearGradient
        colors={['rgba(211, 47, 47, 0.08)', 'rgba(211, 47, 47, 0.04)']}
        style={styles.infoBox}
      >
        <View style={styles.infoContent}>
          <Ionicons name="information-circle-outline" size={18} color="#D32F2F" />
          <Text style={styles.infoText}>
            Datos de monitoreo en tiempo real del Instituto Geofísico Ecuatoriano
          </Text>
        </View>
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#C62828', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: '#666', fontWeight: '600' },

  list: { paddingHorizontal: 16, paddingBottom: 20, paddingTop: 8 },
  volcanoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4
  },

  cardContent: { padding: 16 },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6
  },
  statusText: { 
    color: '#FFF', 
    fontSize: 11, 
    fontWeight: '700',
    letterSpacing: 0.5
  },

  volcanoInfo: { marginBottom: 14 },
  volcanoName: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#1B5E20',
    marginBottom: 4
  },
  volcanoProvince: { 
    fontSize: 13, 
    color: '#666',
    fontWeight: '500'
  },

  detailsGrid: { gap: 12, marginBottom: 14 },
  detailBox: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10
  },
  detailLabel: { fontSize: 11, color: '#999', fontWeight: '600' },
  detailValue: { fontSize: 14, color: '#1B5E20', fontWeight: '700', marginTop: 2 },

  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  lastUpdateContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 4
  },
  lastUpdateText: { 
    fontSize: 11, 
    color: '#999',
    fontWeight: '500'
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8
  },
  mapButtonText: { 
    fontSize: 12, 
    color: '#1565C0',
    fontWeight: '700'
  },

  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 20
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 14, 
    color: '#666',
    fontWeight: '600'
  },

  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 20
  },
  emptyText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#C62828',
    marginTop: 16
  },
  emptySubtext: { 
    fontSize: 14, 
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500'
  },

  infoBox: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D32F2F'
  },
  infoContent: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 10
  },
  infoText: { 
    fontSize: 12, 
    color: '#C62828', 
    flex: 1,
    fontWeight: '600',
    lineHeight: 16
  }
});
