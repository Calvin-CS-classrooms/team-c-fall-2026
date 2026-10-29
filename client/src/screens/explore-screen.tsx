import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Chip } from '@/components/chip';
import { DensityOverviewCard } from '@/components/density-overview-card';
import { LandmarkCard } from '@/components/landmark-card';
import { StarRating } from '@/components/star-rating';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { locations } from '@/data/locations';
import type { Category, DensityLevel } from '@/types';
import { formatMinutesAgo } from '@/utils/format';


const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'study', label: 'Study & Quiet' },
  { key: 'dining', label: 'Dining & Cafes' },
  { key: 'athletics', label: 'Athletics & Rec' },
  { key: 'events', label: 'Events' },
];

// Numeric ranking of each density level so an average can be computed.
const DENSITY_ORDER: Record<DensityLevel, number> = { quiet: 0, moderate: 1, busy: 2 };

// Computes the campus-wide density by averaging every location's density
// rank, then mapping the average back to a level via fixed thresholds.
// This is a hard-coded stand-in for live occupancy data.
function overallDensity(): DensityLevel {
  const average =
    locations.reduce((sum, location) => sum + DENSITY_ORDER[location.density], 0) / locations.length;
  if (average < 0.66) return 'quiet';
  if (average < 1.33) return 'moderate';
  return 'busy';
}

/**
 * Explore screen: browse all campus locations. Contains category filter
 * chips, an overall campus density card, a scrollable landmark directory,
 * and a recent-ratings section (global, not user-specific).
 *
 * Uses useMemo to cache derived values between re-renders, recomputing only
 * when their dependencies change.
 */
export function ExploreScreen() {
  const { isFavorite, toggleFavorite, ratings } = useAppData();
  const [category, setCategory] = useState<Category>('study');

  // Locations belonging to the currently selected category.
  const filteredLocations = useMemo(
    () => locations.filter((location) => location.category === category),
    [category],
  );

  // The 3 most recent ratings for locations in the current category.
  // Ratings are client-only for now, using each rating's hard-coded
  // "createdMinutesAgo" value; a copy is sorted so `ratings` is not mutated.
  const recentRatings = useMemo(() => {
    const locationIds = new Set(filteredLocations.map((location) => location.id));
    return ratings
      .filter((rating) => locationIds.has(rating.locationId))
      .slice()
      .sort((first, second) => first.createdMinutesAgo - second.createdMinutesAgo)
      .slice(0, 3);
  }, [filteredLocations, ratings]);

  // Per-category density breakdown for the overview card. "Events" is
  // excluded since it has no meaningful density. Math.max guards against
  // dividing by zero when a category has no locations.
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

        {/* Recent ratings only make sense for real locations, so hide this
            section when the "Events" category is selected. */}
        {category !== 'events' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Ratings</Text>
            {recentRatings.length > 0 ? (
              <View style={styles.ratingList}>
                {recentRatings.map((rating) => (
                  <View key={rating.id} style={styles.ratingCard}>
                    <View style={styles.ratingHeader}>
                      <Text style={styles.ratingLocation}>{rating.locationName}</Text>
                      <Text style={styles.ratingTime}>{formatMinutesAgo(rating.createdMinutesAgo)}</Text>
                    </View>
                    <StarRating value={rating.stars} readOnly size={15} />
                    {rating.comment ? <Text style={styles.ratingComment}>{rating.comment}</Text> : null}
                    <Text style={styles.ratingMeta}>
                      {rating.capacity}% busy ·{' '}
                      {rating.amenities.length > 0 ? rating.amenities.join(', ') : 'No amenities noted'}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptySubtitle}>No ratings for this category yet.</Text>
              </View>
            )}
          </View>
        ) : null}
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
  ratingList: {
    gap: 10,
  },
  ratingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 7,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  ratingLocation: {
    flex: 1,
    fontFamily: Typography.bold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  ratingTime: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  ratingComment: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ratingMeta: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.textMuted,
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
