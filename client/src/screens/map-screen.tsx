import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

const FLOORS = [
  { label: 'Floor 2', image: require('@/assets/images/Library_Floor_2_Map.png'), places: 'Reading Room and study tables' },
  { label: 'Floor 3', image: require('@/assets/images/Library_Floor_3_Map.png'), places: 'Group study rooms and collaboration tables' },
  { label: 'Floor 4', image: require('@/assets/images/Library_Floor_4_Map.png'), places: 'Silent study floor and individual desks' },
  { label: 'Floor 5', image: require('@/assets/images/Library_Floor_5_Map.png'), places: 'Upper stacks and quiet study areas' },
];

export function MapScreen() {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const floor = FLOORS[selectedFloor];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader title="Campus Map" subtitle="Find your place on campus" />

        <View style={styles.section}>
          <Text style={styles.eyebrow}>Calvin University</Text>
          <Text style={styles.title}>Campus overview</Text>
          <Text style={styles.description}>Explore the campus map, then open the library floor plans below.</Text>
          <View style={styles.campusMapCard}>
            <WebView
              source={{ uri: 'https://www.google.com/maps/search/?api=1&query=Calvin+University%2C+3201+Burton+SE%2C+Grand+Rapids%2C+MI+49546' }}
              style={styles.campusMap}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              accessibilityLabel="Google map of Calvin University campus"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.eyebrow}>Hekman Library</Text>
          <Text style={styles.title}>Library floors</Text>
          <Text style={styles.description}>Choose a floor to see where study areas and rooms are located.</Text>

          <View style={styles.floorRow}>
            {FLOORS.map((entry, index) => (
              <Pressable
                key={entry.label}
                onPress={() => setSelectedFloor(index)}
                style={[styles.floorButton, selectedFloor === index && styles.floorButtonActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedFloor === index }}
              >
                <Text style={[styles.floorButtonText, selectedFloor === index && styles.floorButtonTextActive]}>
                  {entry.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.mapCard}>
            <Image source={floor.image} style={styles.mapImage} contentFit="contain" />
            <View style={styles.mapCaption}>
              <Text style={styles.mapTitle}>{floor.label}</Text>
              <Text style={styles.mapPlaces}>{floor.places}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  section: { paddingHorizontal: 20, marginTop: 18, gap: 10 },
  eyebrow: { fontFamily: Typography.semiBold, fontSize: 12, color: Colors.maroon, textTransform: 'uppercase' },
  title: { fontFamily: Typography.bold, fontSize: 24, color: Colors.textPrimary },
  description: { fontFamily: Typography.medium, fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  floorRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  floorButton: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  floorButtonActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  floorButtonText: { fontFamily: Typography.semiBold, fontSize: 12, color: Colors.textSecondary },
  floorButtonTextActive: { color: Colors.white },
  mapCard: { overflow: 'hidden', borderRadius: 18, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, marginTop: 6 },
  campusMapCard: { overflow: 'hidden', height: 360, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, marginTop: 6 },
  campusMap: { flex: 1 },
  mapImage: { width: '100%', height: 420, backgroundColor: Colors.surfaceAlt },
  mapCaption: { padding: 14, gap: 3 },
  mapTitle: { fontFamily: Typography.bold, fontSize: 16, color: Colors.textPrimary },
  mapPlaces: { fontFamily: Typography.medium, fontSize: 12, color: Colors.textSecondary },
});
