import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
  Alert, ScrollView, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { SERVER_URL } from '../src/config';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  data?: any;
  isAudio?: boolean;
}

export default function PredictScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    requestLocationPermission();
    requestAudioPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
        console.log('📍 Ubicación obtenida:', { lat: loc.coords.latitude, lon: loc.coords.longitude });
      } else {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const requestAudioPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso al micrófono para grabar audio');
      } else {
        console.log('🎤 Permisos de audio concedidos');
      }
    } catch (error) {
      console.error('Error requesting audio permission:', error);
    }
  };

  const getRiskColor = (level: string): [string, string] => {
    switch (level?.toLowerCase()) {
      case 'alto':
        return ['#FF5252', '#FF1744'];
      case 'medio':
        return ['#FFC107', '#FF9800'];
      case 'bajo':
        return ['#4CAF50', '#45a049'];
      default:
        return ['#2196F3', '#1976D2'];
    }
  };

  const getRiskIcon = (level: string): keyof typeof Ionicons.glyphMap => {
    switch (level?.toLowerCase()) {
      case 'alto':
        return 'alert-circle';
      case 'medio':
        return 'warning';
      case 'bajo':
        return 'checkmark-circle';
      default:
        return 'help-circle';
    }
  };

  const startRecording = async () => {
    try {
      // Si ya hay grabación, detenerla primero
      if (recording) {
        console.log('🧹 Limpiando grabación anterior...');
        try {
          await recording.stopAndUnloadAsync();
          setRecording(null);
          setIsRecording(false);
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (e) {
          console.log('⚠️ No se pudo limpiar grabación anterior');
          setRecording(null);
          setIsRecording(false);
        }
      }

      // Verificar y obtener ubicación PRIMERO
      if (!location) {
        console.log('📍 Ubicación no disponible, intentando obtener...');
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
          console.log('📍 Ubicación obtenida:', { lat: loc.coords.latitude, lon: loc.coords.longitude });
        } catch (locError) {
          console.error('📍 Error obteniendo ubicación:', locError);
          Alert.alert('Ubicación requerida', 'Activa GPS en configuración del celular');
          return;
        }
      }

      console.log('🎤 Iniciando grabación...');
      
      // Configurar audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      // Pequeño delay para asegurar liberación
      await new Promise(resolve => setTimeout(resolve, 200));

      // Crear nueva grabación con formato M4A
      const { recording: newRecording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
        },
        web: {
          mimeType: 'audio/mp4',
          bitsPerSecond: 128000,
        }
      });

      setRecording(newRecording);
      setIsRecording(true);
      console.log('🔴 Grabando...');
    } catch (err) {
      console.error('❌ Error al iniciar grabación:', err);
      setRecording(null);
      setIsRecording(false);
      Alert.alert('Error de Micrófono', 'Intenta de nuevo. Si el error persiste, reinicia la app.');
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      console.log('⚠️ No hay grabación activa');
      return;
    }

    try {
      console.log('⏹️ Deteniendo grabación...');
      setIsRecording(false);
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        console.log('📁 Audio guardado en:', uri);
        await sendAudioMessage(uri);
      } else {
        Alert.alert('Error', 'No se pudo obtener el archivo de audio');
      }
    } catch (err) {
      console.error('❌ Error al detener grabación:', err);
      setRecording(null);
      Alert.alert('Error', 'No se pudo procesar el audio. Intenta de nuevo.');
    }
  };

  // Comprueba que el servidor responda (con timeout)
  const checkServerAlive = async (timeout = 4000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const resp = await fetch(`${SERVER_URL.replace(/\/$/, '')}/`, { signal: controller.signal });
      clearTimeout(id);
      return resp.ok;
    } catch (e) {
      clearTimeout(id);
      return false;
    }
  };

  const sendAudioMessage = async (audioUri: string) => {
    setLoading(true);

    try {
      if (!SERVER_URL) {
        throw new Error('URL del servidor no configurada');
      }

      console.log('🌐 SERVER_URL:', SERVER_URL);
      console.log('📍 Location:', location);
      console.log('🎤 Audio URI:', audioUri);

      // Health check rapido antes de enviar el audio
      const alive = await checkServerAlive(4000);
      console.log('🔎 Server alive:', alive);
      if (!alive) {
        throw new Error('No se puede conectar al servidor. Verifica WiFi/Firewall.');
      }

      // Crear mensaje de usuario con indicador de audio
      const userMessage: Message = {
        id: Date.now().toString(),
        text: '🎤 Mensaje de audio',
        isUser: true,
        timestamp: new Date(),
        isAudio: true
      };
      setMessages(prev => [...prev, userMessage]);

      // Preparar FormData - Manera correcta para React Native
      const formData = new FormData();
      
      // El URI ya tiene la extensión .m4a, lo usamos directamente
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      formData.append('latitude', location!.lat.toString());
      formData.append('longitude', location!.lon.toString());

      console.log('📤 Enviando audio a:', `${SERVER_URL.replace(/\/$/, '')}/api/audio-weather`);
      console.log('🎵 URI del audio:', audioUri);

      const resp = await fetch(`${SERVER_URL.replace(/\/$/, '')}/api/audio-weather`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('📥 Respuesta status:', resp.status);

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error del servidor: ${resp.status} - ${errorText}`);
      }

      const data = await resp.json();
      console.log('✅ Datos recibidos:', data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || 'No se pudo obtener respuesta',
        isUser: false,
        timestamp: new Date(),
        data: data.weather_data || data.result
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (data.result || data.weather_data) {
        setResult(data.result || data.weather_data);
      }

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (err: any) {
      console.error('❌ Error completo:', err);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Lo siento, hubo un error al procesar el audio: ${err.message}. Por favor intenta de nuevo.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPredict = async () => {
    if (!location) {
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      } catch (err) {
        Alert.alert('Ubicación', 'Por favor activa GPS en configuración');
        return;
      }
    }

    if (!location) {
      Alert.alert('Ubicación', 'No se pudo obtener la ubicación');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        location: { name: 'Ubicación actual', lat: location.lat, lon: location.lon },
        history: [],
        notes: 'Predicción rápida desde la app'
      };

      if (!SERVER_URL) {
        Alert.alert('Configuración', 'No se ha configurado la URL del servidor.');
        setLoading(false);
        return;
      }

      console.log('📤 Enviando predicción rápida...');

      const resp = await fetch(`${SERVER_URL.replace(/\/$/, '')}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        throw new Error(`Error del servidor: ${resp.status}`);
      }

      const data = await resp.json();
      setResult(data.result || data);

      const newMessage: Message = {
        id: Date.now().toString(),
        text: 'Predicción generada para tu ubicación actual',
        isUser: false,
        timestamp: new Date(),
        data: data.result || data
      };
      setMessages(prev => [...prev, newMessage]);
      
      console.log('✅ Predicción obtenida');
    } catch (err: any) {
      console.error('❌ Error en predict:', err);
      Alert.alert('Error', err.message || 'Error al solicitar predicción');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    // Verificar ubicación
    if (!location) {
      console.log('📍 Intentando obtener ubicación...');
      const loc = await Location.getCurrentPositionAsync({}).catch(() => null);
      if (loc) {
        setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
        console.log('📍 Ubicación obtenida:', { lat: loc.coords.latitude, lon: loc.coords.longitude });
      } else {
        Alert.alert('Ubicación requerida', 'No pudimos obtener tu ubicación. Por favor actívala en configuración.');
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      if (!SERVER_URL) {
        throw new Error('URL del servidor no configurada');
      }

      const payload = {
        question: inputText.trim(),
        location: { lat: location.lat, lon: location.lon },
        timestamp: new Date().toISOString()
      };

      console.log('📤 Enviando mensaje de texto...');

      const resp = await fetch(`${SERVER_URL.replace(/\/$/, '')}/api/chat-weather`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        throw new Error(`Error del servidor: ${resp.status}`);
      }

      const data = await resp.json();
      console.log('✅ Respuesta recibida');

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || 'No se pudo obtener respuesta',
        isUser: false,
        timestamp: new Date(),
        data: data.weather_data || data.result
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (data.result || data.weather_data) {
        setResult(data.result || data.weather_data);
      }

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (err: any) {
      console.error('❌ Error en chat:', err);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Lo siento, hubo un error: ${err.message}. Por favor intenta de nuevo.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage
      ]}
    >
      {!message.isUser && (
        <View style={styles.aiIconContainer}>
          <Ionicons name="sparkles" size={16} color="#1976D2" />
        </View>
      )}
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userText : styles.aiText
        ]}>
          {message.text}
        </Text>
        {message.data && message.data.risk_level && (
          <View style={styles.miniResultCard}>
            <LinearGradient
              colors={getRiskColor(message.data.risk_level)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.miniRiskBadge}
            >
              <Ionicons 
                name={getRiskIcon(message.data.risk_level)} 
                size={16} 
                color="#FFF" 
              />
              <Text style={styles.miniRiskText}>
                {message.data.risk_level.toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );

  const handleMicPress = async () => {
    if (isRecording) {
      // Si está grabando, detener
      await stopRecording();
    } else {
      // Si no está grabando, iniciar
      await startRecording();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#E3F2FD', '#BBDEFB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="sparkles" size={28} color="#1976D2" />
            <View style={styles.headerText}>
              <Text style={styles.title}>Asistente Climático</Text>
              <Text style={styles.subtitle}>Pregunta con texto o voz</Text>
            </View>
          </View>
        </View>

        {/* Quick Predict Button */}
        <View style={styles.quickButtonContainer}>
          <TouchableOpacity
            onPress={handleQuickPredict}
            disabled={loading}
            activeOpacity={0.8}
            style={styles.quickButton}
          >
            <LinearGradient
              colors={['#1976D2', '#1565C0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickButtonGradient}
            >
              <Ionicons name="flash" size={18} color="#FFF" />
              <Text style={styles.quickButtonText}>Predicción Ahora</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={60} color="rgba(25, 118, 210, 0.3)" />
              <Text style={styles.emptyStateTitle}>Haz tu primera consulta</Text>
              <Text style={styles.emptyStateText}>
                Pregunta con texto o mantén presionado el micrófono
              </Text>
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Ejemplos:</Text>
                <TouchableOpacity onPress={() => setInputText('¿Cómo estará el clima el domingo?')}>
                  <Text style={styles.exampleText}>• "¿Cómo estará el clima el domingo?"</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setInputText('¿Lloverá mañana?')}>
                  <Text style={styles.exampleText}>• "¿Lloverá mañana?"</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setInputText('Clima de los próximos 3 días')}>
                  <Text style={styles.exampleText}>• "Clima de los próximos 3 días"</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            messages.map(renderMessage)
          )}

          {loading && (
            <View style={styles.loadingMessage}>
              <ActivityIndicator color="#1976D2" />
              <Text style={styles.loadingText}>
                {isRecording ? 'Grabando...' : 'Analizando...'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={handleMicPress}
            disabled={loading}
            style={[
              styles.micButton,
              isRecording && styles.micButtonRecording
            ]}
          >
            <LinearGradient
              colors={isRecording ? ['#FF5252', '#FF1744'] : ['#1976D2', '#1565C0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.micButtonGradient}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={24} 
                color="#FFF" 
              />
            </LinearGradient>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Pregunta sobre el clima..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={200}
            editable={!loading && !isRecording}
            onSubmitEditing={handleSendMessage}
          />
          
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={loading || !inputText.trim() || isRecording}
            style={[
              styles.sendButton,
              (!inputText.trim() || loading || isRecording) && styles.sendButtonDisabled
            ]}
          >
            <LinearGradient
              colors={inputText.trim() && !loading && !isRecording ? ['#1976D2', '#1565C0'] : ['#B0BEC5', '#90A4AE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  
  header: { 
    paddingTop: 50, 
    paddingHorizontal: 20, 
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '900', color: '#1565C0' },
  subtitle: { fontSize: 13, color: '#666', fontWeight: '600', marginTop: 2 },

  quickButtonContainer: { paddingHorizontal: 20, paddingVertical: 12 },
  quickButton: { borderRadius: 12, overflow: 'hidden' },
  quickButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8
  },
  quickButtonText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  chatContainer: { flex: 1 },
  chatContent: { paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 20 },

  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 40,
    paddingHorizontal: 30
  },
  emptyStateTitle: { 
    fontSize: 18, 
    color: '#1565C0', 
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8
  },
  emptyStateText: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center', 
    fontWeight: '500',
    marginBottom: 24
  },
  examplesContainer: { 
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    padding: 16, 
    borderRadius: 12,
    width: '100%'
  },
  examplesTitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#1565C0',
    marginBottom: 8
  },
  exampleText: { 
    fontSize: 13, 
    color: '#555', 
    marginVertical: 4,
    fontWeight: '500'
  },

  messageContainer: { 
    flexDirection: 'row', 
    marginVertical: 6,
    alignItems: 'flex-end'
  },
  userMessage: { justifyContent: 'flex-end' },
  aiMessage: { justifyContent: 'flex-start' },
  
  aiIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },

  messageBubble: { 
    maxWidth: '75%', 
    padding: 12, 
    borderRadius: 16 
  },
  userBubble: { 
    backgroundColor: '#1976D2',
    borderBottomRightRadius: 4
  },
  aiBubble: { 
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },

  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#FFFFFF', fontWeight: '500' },
  aiText: { color: '#333', fontWeight: '500' },

  miniResultCard: { marginTop: 8 },
  miniRiskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  miniRiskText: { fontSize: 12, fontWeight: '700', color: '#FFF' },

  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12
  },
  loadingText: { fontSize: 14, color: '#666', fontWeight: '500' },

  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
    gap: 10
  },
  micButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22,
    overflow: 'hidden'
  },
  micButtonRecording: {
    transform: [{ scale: 1.1 }]
  },
  micButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
    fontWeight: '500'
  },
  sendButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22,
    overflow: 'hidden'
  },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});