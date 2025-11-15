import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');

interface VideoItem {
  id: number;
  video_files: { link: string }[];
  user: { name: string };
  description?: string;
}

export default function ClimTokAPI() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const videoRefs = useRef<Map<number, Video>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('https://api.pexels.com/videos/popular', {
        headers: { Authorization: 'Kr9LEbuc0eBQbdZe2iyILdSGGCCvATVt5RY7c5Wy403lTxeLRSPqZGkK' },
      });
      const data = await res.json();
      setVideos(data.videos);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length === 0) return;
    const index = viewableItems[0].index;
    setCurrentIndex(index);

    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) video.playAsync().catch(() => {});
      else video.pauseAsync().catch(() => {});
    });
  }).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id.toString()}
      pagingEnabled
      horizontal={false}
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      removeClippedSubviews
      maxToRenderPerBatch={2}
      windowSize={3}
      renderItem={({ item, index }) => (
        <View style={styles.videoContainer}>
          <Video
            ref={(ref) => {
              if (ref) videoRefs.current.set(index, ref);
              else videoRefs.current.delete(index);
            }}
            source={{ uri: item.video_files[0].link }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={index === currentIndex}
            useNativeControls={false}
          />
          <View style={styles.overlay}>
            <Text style={styles.username}>@{item.user.name}</Text>
            {item.description && <Text style={styles.description}>{item.description}</Text>}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>🌱 Info Climática</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  videoContainer: { width, height, backgroundColor: 'black' },
  video: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 60, left: 20, zIndex: 10 },
  username: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  description: { color: 'white', fontSize: 14, marginBottom: 12 },
  button: { backgroundColor: '#0A5A32', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 25 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
