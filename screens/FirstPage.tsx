import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { supabase } from '../security/supabase';

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  humidity: number;
  wind_speed: number;
  icon: string;
  city: string;
}

interface AlertItem {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  icon: string;
}

export default function HomeScreen({ navigation }: any) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<string>('Quito, Ecuador');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Alerta de Lluvia',
      message: 'Se esperan lluvias intensas en las próximas 3 horas',
      icon: 'rainy'
    },
    {
      id: '2',
      type: 'info',
      title: 'Temperatura Baja',
      message: 'Heladas en zonas altas durante la noche',
      icon: 'snow'
    }
  ]);

  useEffect(() => {
    getLocationAndWeather();
    loadUserProfile();
    
    // Escuchar cuando vuelves a esta pantalla
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserProfile = async () => {
    try {
      console.log('🔍 Cargando perfil en HomeScreen...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('✅ Usuario encontrado:', user.email);
        setUserEmail(user.email || '');
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', user.id)
          .single();

        console.log('📋 Datos del perfil:', profile);
        console.log('❌ Error del perfil:', error);

        if (profile) {
          setUserName(profile.full_name || '');
          console.log('👤 Nombre guardado:', profile.full_name);
          
          if (profile.avatar_url) {
            const { data } = supabase.storage
              .from('avatars')
              .getPublicUrl(profile.avatar_url);
            
            console.log('🖼️ URL del avatar:', data.publicUrl);
            setAvatarUrl(data.publicUrl);
            console.log('✅ avatarUrl state actualizado');
          } else {
            console.log('⚠️ No hay avatar_url');
            setAvatarUrl(null);
          }
        }
      } else {
        console.log('⚠️ No hay usuario');
      }
    } catch (error) {
      console.error('❌ Error completo:', error);
    }
  };

  const getLocationAndWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación para mostrarte alertas locales');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const API_KEY = 'b4a1ed222b7698b16d44ca0070ddf291';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.main) {
        throw new Error('No se pudo obtener el clima');
      }

      setWeather({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        icon: data.weather[0].icon,
        city: data.name
      });
      
      setLocation(data.name);
    } catch (error) {
      console.error('Error getting weather:', error);
      Alert.alert('Error', 'No se pudo cargar el clima. Verifica tu API Key de OpenWeather.');
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (type: 'warning' | 'danger' | 'info'): [string, string] => {
    switch (type) {
      case 'danger': return ['#D32F2F', '#F44336'];
      case 'warning': return ['#F57C00', '#FF9800'];
      case 'info': return ['#1976D2', '#2196F3'];
      default: return ['#388E3C', '#4CAF50'];
    }
  };

  const getWeatherIcon = (description: string) => {
    if (description.includes('lluvia')) return 'rainy';
    if (description.includes('nube')) return 'cloudy';
    if (description.includes('despejado')) return 'sunny';
    if (description.includes('nieve')) return 'snow';
    return 'partly-sunny';
  };

  // Log para verificar el estado antes de renderizar
  console.log('🎨 Renderizando. avatarUrl actual:', avatarUrl);
  console.log('🎨 userName:', userName);
  console.log('🎨 userEmail:', userEmail);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#43A047']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appName}>🏔️ AndesAlert</Text>
            <Text style={styles.locationText}>
              <Ionicons name="location" size={14} color="white" /> {location}
            </Text>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => Alert.alert('Notificaciones', 'No tienes notificaciones nuevas')}
            >
              <Ionicons name="notifications" size={24} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              {avatarUrl ? (
                <Image 
                  source={{ uri: `${avatarUrl}?t=${Date.now()}` }} 
                  style={styles.profileAvatar}
                  onError={(e) => console.log('❌ Error cargando imagen:', e.nativeEvent.error)}
                  onLoad={() => console.log('✅ Imagen cargada correctamente')}
                />
              ) : (
                <View style={styles.profileAvatarPlaceholder}>
                  <Text style={styles.profileAvatarText}>
                    {userName ? userName.charAt(0).toUpperCase() : userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.weatherLoading}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Cargando clima...</Text>
          </View>
        ) : weather ? (
          <View style={styles.weatherCard}>
            <View style={styles.weatherMain}>
              <Ionicons 
                name={getWeatherIcon(weather.description)} 
                size={80} 
                color="white" 
              />
              <View style={styles.weatherTemp}>
                <Text style={styles.tempNumber}>{weather.temp}°</Text>
                <Text style={styles.tempDescription}>{weather.description}</Text>
              </View>
            </View>
            
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetailItem}>
                <Ionicons name="water" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherDetailText}>{weather.humidity}%</Text>
                <Text style={styles.weatherDetailLabel}>Humedad</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Ionicons name="thermometer" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherDetailText}>{weather.feels_like}°</Text>
                <Text style={styles.weatherDetailLabel}>Sensación</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Ionicons name="speedometer" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherDetailText}>{weather.wind_speed} m/s</Text>
                <Text style={styles.weatherDetailLabel}>Viento</Text>
              </View>
            </View>
          </View>
        ) : null}
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Alertas Activas</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {alerts.map((alert) => (
          <TouchableOpacity key={alert.id} activeOpacity={0.8}>
            <LinearGradient
              colors={getAlertColor(alert.type)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.alertCard}
            >
              <View style={styles.alertIcon}>
                <Ionicons name={alert.icon as keyof typeof Ionicons.glyphMap} size={28} color="white" />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Mapa')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00BCD4', '#00E5FF']}
              style={styles.actionGradient}
            >
              <Ionicons name="map" size={32} color="white" />
              <Text style={styles.actionText}>Mapa de{'\n'}Riesgos</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Emergencia')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#D32F2F', '#F44336']}
              style={styles.actionGradient}
            >
              <Ionicons name="medical" size={32} color="white" />
              <Text style={styles.actionText}>Plan de{'\n'}Emergencia</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Educacion')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00C853', '#00E676']}
              style={styles.actionGradient}
            >
              <Ionicons name="school" size={32} color="white" />
              <Text style={styles.actionText}>Educación{'\n'}Climática</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Acciones')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6F00', '#FFB300']}
              style={styles.actionGradient}
            >
              <Ionicons name="leaf" size={32} color="white" />
              <Text style={styles.actionText}>Acciones{'\n'}Sostenibles</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <LinearGradient
            colors={['rgba(0, 200, 83, 0.1)', 'rgba(0, 200, 83, 0.05)']}
            style={styles.infoGradient}
          >
            <Ionicons name="information-circle" size={24} color="#00C853" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Mantente preparado</Text>
              <Text style={styles.infoText}>
                Revisa tu plan familiar y asegúrate de tener tu kit de emergencia listo
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Tu Impacto</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#00C853', '#00E676']}
                style={styles.statIcon}
              >
                <Ionicons name="checkmark-done" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Acciones</Text>
            </View>

            <View style={styles.statItem}>
              <LinearGradient
                colors={['#FF6F00', '#FFB300']}
                style={styles.statIcon}
              >
                <Ionicons name="trophy" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.statNumber}>350</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>

            <View style={styles.statItem}>
              <LinearGradient
                colors={['#1976D2', '#2196F3']}
                style={styles.statIcon}
              >
                <Ionicons name="ribbon" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Insignias</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherLoading: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 14,
  },
  weatherCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  weatherTemp: {
    marginLeft: 20,
  },
  tempNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: 'white',
  },
  tempDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'capitalize',
    marginTop: -5,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  weatherDetailItem: {
    alignItems: 'center',
  },
  weatherDetailText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  weatherDetailLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#00C853',
    fontSize: 14,
    fontWeight: '600',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  alertIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertMessage: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 25,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
  },
  infoGradient: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
});