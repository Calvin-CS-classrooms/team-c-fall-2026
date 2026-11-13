import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { LandmarkCard } from '@/components/landmark-card';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { categories } from '@/data/categories';
import { getFloorById } from '@/data/floors';
import { getLocationById } from '@/data/locations';
import { getSpacesByLocationId } from '@/data/spaces';
import { goBack } from '@/utils/navigation';

/**
 * Location detail screen: shows all the spaces within a single location.
 * Reached by tapping a location on the explore screen.
 */
export function LocationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const locationId = Number(id);
  const { isFavorite, toggleFavorite } = useAppData();

  const location = getLocationById(locationId);
  const locationSpaces = getSpacesByLocationId(locationId);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Pressable style={styles.backRow} onPress={() => goBack(router)} accessibilityRole="button">
            <Ionicons name="chevron-back" size={18} color={Colors.maroon} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <AppHeader title={location?.name ?? 'Location'} subtitle="Spaces in this location" />

        <View style={styles.section}>
          {location ? <Text style={styles.description}>{location.description}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spaces</Text>
          {locationSpaces.length > 0 ? (
            <View style={styles.spaceList}>
              {locationSpaces.map((space) => {
                const categoryName = categories.find((c) => c.id === space.categoryId)?.name ?? 'Space';
                const floor = getFloorById(space.floorId);
                return (
                  <LandmarkCard
                    key={space.id}
                    space={space}
                    name={space.name}
                    categoryName={categoryName}
                    floorName={floor?.name ?? 'Floor'}
                    isFavorite={isFavorite(space.id)}
                    onToggleFavorite={() => toggleFavorite(space)}
                  />
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No spaces here yet</Text>
              <Text style={styles.emptySubtitle}>Check back soon.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 12,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.maroon,
  },
  description: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  spaceList: {
    gap: 14,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  emptyTitle: {
    fontFamily: Typography.bold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
