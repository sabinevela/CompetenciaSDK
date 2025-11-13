import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación inicial
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación continua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Animación flotante continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#43A047', '#66BB6A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Elementos decorativos flotantes */}
        <Animated.View 
          style={[
            styles.decorativeCircle1,
            { transform: [{ rotate }] }
          ]}
        />
        <Animated.View 
          style={[
            styles.decorativeCircle2,
            { transform: [{ rotate }] }
          ]}
        />
        <View style={styles.decorativeCircle3} />
        <View style={styles.decorativeCircle4} />
        
        <Animated.View 
          style={[
            styles.headerContent,
            { 
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.logoContainer,
              { transform: [{ translateY: floatAnim }] }
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.logoCircle}
            >
              <View style={styles.logoInnerCircle}>
                <Text style={styles.logoEmoji}>🏔️</Text>
              </View>
            </LinearGradient>
            <View style={styles.glowEffect} />
          </Animated.View>
          
          <Text style={styles.appTitle}>Andes Alert</Text>
          <View style={styles.subtitleContainer}>
            <View style={styles.subtitleDot} />
            <Text style={styles.appSubtitle}>Tu protección climática personal</Text>
            <View style={styles.subtitleDot} />
          </View>
        </Animated.View>

        {/* Iconos flotantes decorativos */}
        <Animated.View style={[styles.floatingIcon, styles.icon1, { opacity: fadeAnim }]}>
          <Ionicons name="rainy" size={24} color="rgba(255,255,255,0.3)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, styles.icon2, { opacity: fadeAnim }]}>
          <Ionicons name="sunny" size={20} color="rgba(255,255,255,0.25)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, styles.icon3, { opacity: fadeAnim }]}>
          <Ionicons name="thunderstorm" size={22} color="rgba(255,255,255,0.2)" />
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.whiteSection}>
          {/* Cards de características */}
          <View style={styles.featuresContainer}>
            <Animated.View 
              style={[
                styles.featureCard,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={['#E8F5E9', '#F1F8E9']}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="notifications" size={28} color="#2E7D32" />
                </View>
                <Text style={styles.featureTitle}>Alertas en Tiempo Real</Text>
                <Text style={styles.featureText}>Notificaciones instantáneas</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.View 
              style={[
                styles.featureCard,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateX: Animated.multiply(slideAnim, -1) }]
                }
              ]}
            >
              <LinearGradient
                colors={['#E3F2FD', '#E1F5FE']}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="shield-checkmark" size={28} color="#1976D2" />
                </View>
                <Text style={styles.featureTitle}>Protección Total</Text>
                <Text style={styles.featureText}>Tu familia segura</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.View 
              style={[
                styles.featureCard,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={['#FFF3E0', '#FFE0B2']}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="analytics" size={28} color="#F57C00" />
                </View>
                <Text style={styles.featureTitle}>Datos Precisos</Text>
                <Text style={styles.featureText}>Información confiable</Text>
              </LinearGradient>
            </Animated.View>
          </View>

          <View style={styles.messageSection}>
            <Text style={styles.messageTitle}>¡Comencemos! 🌱</Text>
            <Text style={styles.messageDescription}>
              Únete a miles de personas que protegen su bienestar con alertas climáticas inteligentes
            </Text>
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient
                colors={['#1B5E20', '#2E7D32', '#43A047']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
                <View style={styles.buttonIconCircle}>
                  <Ionicons name="arrow-forward" size={20} color="#1B5E20" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Register')}
            >
              <LinearGradient
                colors={['#FFFFFF', '#FFFFFF']}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Crear Cuenta Nueva</Text>
                <Ionicons name="person-add" size={20} color="#2E7D32" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Seguro y confiable</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.termsText}>
              🔒 Al continuar, aceptas nuestros términos y condiciones de privacidad
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    height: height * 0.5,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 100,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  decorativeCircle4: {
    position: 'absolute',
    bottom: 80,
    left: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInnerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 70,
  },
  glowEffect: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -10,
    left: -10,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subtitleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    textAlign: 'center',
  },
  floatingIcon: {
    position: 'absolute',
  },
  icon1: {
    top: 120,
    left: 30,
  },
  icon2: {
    top: 180,
    right: 50,
  },
  icon3: {
    bottom: 100,
    left: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  whiteSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: height * 0.5,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  messageSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1B5E20',
    marginBottom: 16,
    textAlign: 'center',
  },
  messageDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonSection: {
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    gap: 10,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});