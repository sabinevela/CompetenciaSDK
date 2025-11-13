import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
  Alert, ScrollView, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { SERVER_URL } from '../src/config';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  data?: any;
}

export default function PredictScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      }
    } catch (error) {
      console.error('Error getting location:', error);
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

  const getRiskIcon = (level: string): string => {
    switch (level?.toLowerCase()) {
      case 'alto':
        return 'alert';
      case 'medio':
        return 'warning';
      case 'bajo':
        return 'checkmark-done';
      default:
        return 'help';
    }
  };

  const handleQuickPredict = async () => {
    if (!location) {
      Alert.alert('Ubicación', 'Esperando permisos de ubicación...');
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

      const resp = await fetch(`${SERVER_URL.replace(/\/$/, '')}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      setResult(data.result || data);

      // Agregar mensaje del sistema
      const newMessage: Message = {
        id: Date.now().toString(),
        text: 'Predicción generada para tu ubicación actual',
        isUser: false,
        timestamp: new Date(),
        data: data.result || data
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (err: any) {
      console.error('predict error', err);
      Alert.alert('Error', err.message || 'Error al solicitar predicción');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    if (!location) {
      Alert.alert('Ubicación requerida', 'Necesitamos tu ubicación para responder consultas climáticas.');
      return;
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

      // Enviar la pregunta al backend con contexto de ubicación
      const payload = {
        question: inputText.trim(),
        location: { lat: location.lat, lon: location.lon },
        timestamp: new Date().toISOString()
      };

      const resp = await fetch(`${SERVER_URL.replace(/\/$/, '')}/api/chat-weather`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        throw new Error(`Error del servidor: ${resp.status}`);
      }

      const data = await resp.json();

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

      // Scroll al final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (err: any) {
      console.error('chat error', err);
      
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
              <Text style={styles.subtitle}>Pregunta sobre el clima de cualquier día</Text>
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
                Pregunta sobre el clima de cualquier día
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
              <Text style={styles.loadingText}>Analizando...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pregunta sobre el clima..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={200}
            editable={!loading}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={loading || !inputText.trim()}
            style={[
              styles.sendButton,
              (!inputText.trim() || loading) && styles.sendButtonDisabled
            ]}
          >
            <LinearGradient
              colors={inputText.trim() && !loading ? ['#1976D2', '#1565C0'] : ['#B0BEC5', '#90A4AE']}
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