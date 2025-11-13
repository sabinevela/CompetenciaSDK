import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../security/supabase';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    // Validaciones
    if (!name || !email || !password || !confirm) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert('Nombre inválido', 'El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // Crear usuario en Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            avatar_url: '',
          }
        }
      });

      if (error) throw error;

      // Crear perfil en la tabla profiles
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: name,
              email: email,
              avatar_url: null,
              created_at: new Date().toISOString(),
            }
          ]);

        if (profileError) {
          console.log('Error al crear perfil:', profileError);
        }
      }

      Alert.alert(
        '¡Registro exitoso! 🌱',
        `Bienvenida/o ${name}. ${data.user?.email_confirmed_at ? 'Tu cuenta ha sido creada.' : 'Revisa tu correo para confirmar tu cuenta.'}`,
        [
          {
            text: 'Comenzar',
            onPress: () => {
              // Si quieres que vaya al login:
              navigation.navigate('Login')
              // O simplemente no hagas nada y onAuthStateChange lo manejará
            }
          }
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Ocurrió un error al crear la cuenta';

      if (error.message.includes('User already registered')) {
        errorMessage = 'Este correo electrónico ya está registrado';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres';
      }

      Alert.alert('Error de registro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#1B5E20" />
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>¡Únete a nosotros!</Text>
          <Text style={styles.subtitle}>Crea tu cuenta en ClimAct 🌱</Text>
        </View>

        <View style={styles.decorativeElements}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <View style={styles.floatingLabel}>
                <Ionicons name="person-outline" size={16} color="#2E7D32" />
                <Text style={styles.labelText}>Nombre completo</Text>
              </View>
              <TextInput
                style={styles.modernInput}
                placeholder="Tu nombre completo"
                placeholderTextColor="#B0BEC5"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.floatingLabel}>
                <Ionicons name="mail-outline" size={16} color="#2E7D32" />
                <Text style={styles.labelText}>Email</Text>
              </View>
              <TextInput
                style={styles.modernInput}
                placeholder="ejemplo@email.com"
                placeholderTextColor="#B0BEC5"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.floatingLabel}>
                <Ionicons name="lock-closed-outline" size={16} color="#2E7D32" />
                <Text style={styles.labelText}>Contraseña</Text>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.modernInput}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#B0BEC5"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#66BB6A"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.floatingLabel}>
                <Ionicons name="lock-closed-outline" size={16} color="#2E7D32" />
                <Text style={styles.labelText}>Confirmar contraseña</Text>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.modernInput}
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor="#B0BEC5"
                  secureTextEntry={!showConfirm}
                  value={confirm}
                  onChangeText={setConfirm}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#66BB6A"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.passwordHint}>
              <Ionicons name="information-circle-outline" size={16} color="#66BB6A" />
              <Text style={styles.hintText}>
                La contraseña debe tener al menos 6 caracteres
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={loading ? ['#A5D6A7', '#81C784'] : ['#43A047', '#66BB6A', '#81C784']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Crear cuenta</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.registerSection}>
              <Text style={styles.noAccountText}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
              >
                <Text style={styles.registerLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
              </Text>
            </View>
          </View>

          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={18} color="#43A047" />
            <Text style={styles.securityText}>Conexión segura y encriptada</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topSection: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleSection: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(67, 160, 71, 0.05)',
    top: 40,
    right: -30,
  },
  circle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(129, 199, 132, 0.08)',
    top: 120,
    right: 60,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  floatingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  modernInput: {
    borderWidth: 2,
    borderColor: '#E8F5E9',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#1B5E20',
    backgroundColor: '#FAFAFA',
    fontWeight: '500',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  passwordHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  hintText: {
    fontSize: 12,
    color: '#66BB6A',
    fontWeight: '600',
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  noAccountText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  registerLink: {
    fontSize: 15,
    fontWeight: '800',
    color: '#43A047',
  },
  termsContainer: {
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 11,
    color: '#81C784',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignSelf: 'center',
  },
  securityText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
});