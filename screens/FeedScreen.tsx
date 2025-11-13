import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { supabase } from '../security/supabase';
import { SERVER_URL } from '../src/config';

interface FeedItem {
  id: string;
  userId: string;
  userName: string;
  message: string;
  type: string;
  location?: { lat: number; lon: number };
  createdAt: string;
}

export default function FeedScreen({ navigation }: any) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadFeed();
    const unsubscribe = navigation.addListener('focus', loadFeed);
    return unsubscribe;
  }, [navigation]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      try {
        const response = await fetch(`${SERVER_URL.replace(/\/$/, '')}/api/feed`);
        const data = await response.json();
        if (data.feed && Array.isArray(data.feed)) {
          setFeed(data.feed);
        }
      } catch (e) {
        console.log('Backend no disponible, usando datos locales');
        setFeed([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostFeed = async () => {
    if (!newPost.trim()) {
      Alert.alert('Campo vacío', 'Escribe un mensaje antes de enviar');
      return;
    }

    try {
      setPosting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single() : { data: null };

      const { status } = await Location.requestForegroundPermissionsAsync();
      let location = null;
      
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        location = { lat: loc.coords.latitude, lon: loc.coords.longitude };
      }

      const payload = {
        userId: user?.id || 'anonymous',
        userName: profile?.full_name || user?.email || 'Anónimo',
        message: newPost,
        type: 'report',
        lat: location?.lat,
        lon: location?.lon
      };

      const response = await fetch(`${SERVER_URL.replace(/\/$/, '')}/api/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Alert.alert('¡Éxito!', 'Tu publicación ha sido compartida');
        setNewPost('');
        loadFeed();
      } else {
        Alert.alert('Error', 'No se pudo enviar el post');
      }
    } catch (err: any) {
      console.error('Error posting:', err);
      Alert.alert('Error', 'Ocurrió un error al enviar tu publicación');
    } finally {
      setPosting(false);
    }
  };

  const getAvatarColor = (name: string): string => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.feedItem}
    >
      <View style={styles.feedHeader}>
        <View style={[styles.avatarSmall, { backgroundColor: getAvatarColor(item.userName) }]}>
          <Text style={styles.avatarText}>{item.userName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.feedMeta}>
          <Text style={styles.feedName}>{item.userName}</Text>
          <Text style={styles.feedTime}>
            {new Date(item.createdAt).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        <View style={[styles.typeBadge, item.type === 'report' && styles.reportBadge]}>
          <Ionicons 
            name={item.type === 'report' ? 'warning' : 'chatbubble'} 
            size={12} 
            color="#FFF" 
          />
        </View>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.feedMessage}>{item.message}</Text>
      </View>

      {item.location && (
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={14} color="#FF6B6B" />
          <Text style={styles.locationText}>Ubicación reportada</Text>
        </View>
      )}
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={['#F0F7F4', '#E8F5E9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header con título */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Feed Comunitario</Text>
            <Text style={styles.headerSubtitle}>Reportes en tiempo real</Text>
          </View>
          <Ionicons name="chatbubbles" size={32} color="#1B5E20" />
        </View>

        {/* Input card */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Reporta lluvias, deslizamientos, volcanes..."
            placeholderTextColor="#999"
            value={newPost}
            onChangeText={setNewPost}
            multiline
            editable={!posting}
            maxLength={280}
          />
          <View style={styles.inputFooter}>
            <Text style={[styles.charCount, newPost.length > 250 && styles.charCountWarning]}>
              {newPost.length}/280
            </Text>
            <TouchableOpacity
              style={[styles.postButton, posting && styles.postButtonDisabled]}
              onPress={handlePostFeed}
              disabled={posting || !newPost.trim()}
            >
              {posting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="send" size={16} color="white" style={{ marginRight: 6 }} />
                  <Text style={styles.postButtonText}>Enviar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Lista de posts */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1B5E20" />
          <Text style={styles.loadingText}>Cargando reportes...</Text>
        </View>
      ) : feed.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="rgba(27, 94, 32, 0.3)" />
          <Text style={styles.emptyText}>Sin reportes aún</Text>
          <Text style={styles.emptySubtext}>Sé el primero en compartir información</Text>
        </View>
      ) : (
        <FlatList
          data={feed}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.feedList}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1B5E20', marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: '#666', fontWeight: '600' },

  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  input: {
    fontSize: 14,
    color: '#1B5E20',
    minHeight: 70,
    maxHeight: 120,
    marginBottom: 8,
    padding: 0
  },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  charCount: { fontSize: 11, color: '#999', fontWeight: '600' },
  charCountWarning: { color: '#FF9800' },

  postButton: {
    flexDirection: 'row',
    backgroundColor: '#1B5E20',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  postButtonDisabled: { opacity: 0.6 },
  postButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },

  feedList: { paddingHorizontal: 16, paddingBottom: 20, paddingTop: 8 },
  feedItem: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },

  feedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: 'white' },
  feedMeta: { flex: 1 },
  feedName: { fontSize: 14, fontWeight: '700', color: '#1B5E20', marginBottom: 2 },
  feedTime: { fontSize: 11, color: '#999', fontWeight: '500' },

  typeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFA07A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reportBadge: { backgroundColor: '#FF6B6B' },

  messageContainer: { marginBottom: 12 },
  feedMessage: { fontSize: 14, color: '#333', lineHeight: 20, fontWeight: '500' },

  locationContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    backgroundColor: 'rgba(255, 107, 107, 0.1)', 
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  locationText: { fontSize: 12, color: '#FF6B6B', fontWeight: '600' },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666', fontWeight: '600' },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#1B5E20', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center', fontWeight: '500' }
});
