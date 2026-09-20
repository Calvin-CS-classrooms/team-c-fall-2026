import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Chip } from '@/components/chip';
import { DensityOverviewCard } from '@/components/density-overview-card';
import { LandmarkCard } from '@/components/landmark-card';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { locations } from '@/data/locations';
import type { Category, DensityLevel } from '@/types';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'study', label: 'Study & Quiet' },
  { key: 'dining', label: 'Dining & Cafes' },
  { key: 'athletics', label: 'Athletics & Rec' },
  { key: 'events', label: 'Events' },
];

const DENSITY_ORDER: Record<DensityLevel, number> = { quiet: 0, moderate: 1, busy: 2 };

function overallDensity(): DensityLevel {
  const average =
    locations.reduce((sum, location) => sum + DENSITY_ORDER[location.density], 0) / locations.length;
  if (average < 0.66) return 'quiet';
  if (average < 1.33) return 'moderate';
  return 'busy';
}

export function ExploreScreen() {
  const { isFavorite, toggleFavorite } = useAppData();
  const [category, setCategory] = useState<Category>('study');

  const filteredLocations = useMemo(
    () => locations.filter((location) => location.category === category),
    [category],
  );

  const breakdown = useMemo(
    () =>
      CATEGORIES.filter((entry) => entry.key !== 'events').map(({ key, label }) => {
        const inCategory = locations.filter((location) => location.category === key);
        const average =
          inCategory.reduce((sum, location) => sum + DENSITY_ORDER[location.density], 0) /
          Math.max(inCategory.length, 1);
        const density: DensityLevel = average < 0.66 ? 'quiet' : average < 1.33 ? 'moderate' : 'busy';
        return { category: label, density };
      }),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader title="Explore Campus" subtitle="Find the right spot, right now" />

        <View style={styles.section}>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((entry) => (
              <Chip
                key={entry.key}
                label={entry.label}
                selected={category === entry.key}
                onPress={() => setCategory(entry.key)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <DensityOverviewCard overallDensity={overallDensity()} breakdown={breakdown} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Landmark Directory</Text>
          {filteredLocations.length > 0 ? (
            <View style={styles.landmarkList}>
              {filteredLocations.map((location) => (
                <LandmarkCard
                  key={location.id}
                  location={location}
                  isFavorite={isFavorite(location.id)}
                  onToggleFavorite={() => toggleFavorite(location)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No live events right now</Text>
              <Text style={styles.emptySubtitle}>Check back soon for campus events and happenings.</Text>
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
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  landmarkList: {
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
