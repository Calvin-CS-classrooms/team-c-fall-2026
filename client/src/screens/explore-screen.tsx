import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Chip } from '@/components/chip';
import { DensityOverviewCard } from '@/components/density-overview-card';
import { LocationCard } from '@/components/location-card';
import { confirmDeleteRating } from '@/components/rating-history-row';
import { StarRating } from '@/components/star-rating';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { categories } from '@/data/categories';
import { getLocationById } from '@/data/locations';
import { getSpacesByLocationId } from '@/data/spaces';
import { getUserById } from '@/data/users';
import type { DensityLevel } from '@/types';
import { summarizeBuilding } from '@/utils/buildings';
import { formatMinutesAgo } from '@/utils/format';
import { isOwnRating, ratingAuthorLabel } from '@/utils/ratings';

// Maps a crowd rating (0-100) to a density level.
function densityForCrowd(crowd: number): DensityLevel {
  if (crowd < 40) return 'quiet';
  if (crowd < 75) return 'moderate';
  return 'busy';
}

// Stable "now" used to compute relative timestamps without calling the
// impure Date.now() during render.
const NOW = Date.now();

// Computes the campus-wide density by averaging every space's crowd rating.
function overallDensity(crowds: number[]): DensityLevel {
  if (crowds.length === 0) return 'quiet';
  const average = crowds.reduce((sum, value) => sum + value, 0) / crowds.length;
  return densityForCrowd(average);
}

/**
 * Explore screen: browse all campus locations. Contains category filter
 * chips (derived from the categories table), an overall campus density
 * card, a scrollable landmark directory, and a recent-ratings section.
 * Tapping a location opens its detail screen listing its spaces.
 *
 * Uses useMemo to cache derived values between re-renders, recomputing only
 * when their dependencies change.
 */
export function ExploreScreen() {
  const router = useRouter();
  const { ratings, locations, spaces, account, deleteRating } = useAppData();
  const [category, setCategory] = useState<number>(categories[0]?.id ?? 1);

  // Locations that have at least one space in the currently selected category.
  const filteredLocations = useMemo(
    () =>
      locations.filter((location) =>
        getSpacesByLocationId(location.id).some((space) => space.categoryId === category),
      ),
    [category, locations],
  );

  // The 3 most recent ratings for spaces in the currently selected category.
  const recentRatings = useMemo(() => {
    const spaceIds = new Set(
      filteredLocations.flatMap((location) => getSpacesByLocationId(location.id).map((space) => space.id)),
    );
    return ratings
      .filter((rating) => spaceIds.has(rating.spaceId))
      .map((rating) => ({
        rating,
        minutesAgo: Math.floor((NOW - new Date(rating.createdAt).getTime()) / 60000),
      }))
      .sort((first, second) => new Date(second.rating.createdAt).getTime() - new Date(first.rating.createdAt).getTime())
      .slice(0, 3);
  }, [filteredLocations, ratings]);

  // Per-category density breakdown for the overview card.
  const breakdown = useMemo(
    () =>
      categories.map(({ id, name }) => {
        const inCategory = spaces.filter((space) => space.categoryId === id);
        const average =
          inCategory.reduce((sum, space) => sum + space.crowdRating, 0) / Math.max(inCategory.length, 1);
        return { category: name, density: densityForCrowd(average) };
      }),
    [spaces],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader title="Explore Campus" subtitle="Find the right spot, right now" />

        <View style={styles.section}>
          <View style={styles.categoryRow}>
            {categories.map((entry) => (
              <Chip
                key={entry.id}
                label={entry.name}
                selected={category === entry.id}
                onPress={() => setCategory(entry.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <DensityOverviewCard
            overallDensity={overallDensity(spaces.map((space) => space.crowdRating))}
            breakdown={breakdown}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Landmark Directory</Text>
          {filteredLocations.length > 0 ? (
            <View style={styles.landmarkList}>
              {filteredLocations.map((location) => {
                // Show the whole building's rating, not just its first space's.
                const buildingSpaces = getSpacesByLocationId(location.id);
                return (
                  <LocationCard
                    key={location.id}
                    stats={summarizeBuilding(buildingSpaces)}
                    name={location.name}
                    subtitle={`${buildingSpaces.length} ${buildingSpaces.length === 1 ? 'space' : 'spaces'}`}
                    image={location.image}
                    width="100%"
                    onPress={() => router.push(`/location/${location.id}` as never)}
                  />
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No locations in this category</Text>
              <Text style={styles.emptySubtitle}>Try another category.</Text>
            </View>
          )}
          <Pressable style={styles.suggestCard} onPress={() => router.push('/suggestions')} accessibilityRole="button">
            <Ionicons name="add-circle-outline" size={22} color={Colors.maroon} />
            <View style={styles.suggestCopy}>
              <Text style={styles.suggestTitle}>Don&apos;t see your spot?</Text>
              <Text style={styles.suggestSubtitle}>Suggest a space or vote on what other students found.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Ratings</Text>
          {recentRatings.length > 0 ? (
            <View style={styles.ratingList}>
              {recentRatings.map(({ rating, minutesAgo }) => {
                const space = spaces.find((s) => s.id === rating.spaceId);
                const location = space ? getLocationById(space.locationId) : undefined;
                const name = location?.name ?? `Space ${rating.spaceId}`;
                return (
                  <View key={rating.id} style={styles.ratingCard}>
                    <View style={styles.ratingHeader}>
                      <Text style={styles.ratingLocation}>{name}</Text>
                      <Text style={styles.ratingTime}>{formatMinutesAgo(minutesAgo)}</Text>
                      {isOwnRating(rating, account?.id) ? (
                        <Pressable
                          onPress={() => confirmDeleteRating(rating, name, () => deleteRating(rating.id))}
                          hitSlop={8}
                          accessibilityRole="button"
                          accessibilityLabel={`Delete your rating for ${name}`}>
                          <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                        </Pressable>
                      ) : null}
                    </View>
                    <Text style={styles.ratingAuthor}>
                      by {ratingAuthorLabel(rating, { currentUserId: account?.id, findUser: getUserById })}
                    </Text>
                    <StarRating value={rating.numStars} readOnly size={15} />
                    {rating.description ? <Text style={styles.ratingComment}>{rating.description}</Text> : null}
                    <Text style={styles.ratingMeta}>{rating.crowdRating}% busy</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptySubtitle}>No ratings for this category yet.</Text>
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
  ratingAuthor: {
    fontFamily: Typography.semiBold,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  suggestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.maroonSoft,
    padding: 14,
  },
  suggestCopy: {
    flex: 1,
    gap: 2,
  },
  suggestTitle: {
    fontFamily: Typography.bold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  suggestSubtitle: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
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
