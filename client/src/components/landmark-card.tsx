import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CapacityMeter } from '@/components/capacity-meter';
import { Chip } from '@/components/chip';
import { StarRating } from '@/components/star-rating';
import { Colors, NoiseLabels } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import type { Space } from '@/types';

interface LandmarkCardProps {
  space: Space;
  name: string;
  categoryName: string;
  floorName: string;
  amenities: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRate: () => void;
}

/**
 * A card for one space on a building's detail page. Shows the space's name,
 * category, floor, description, crowd rating, noise level, and what it offers.
 * There is no image: the building's photo is shown once at the top of the page.
 * An expandable section reveals more details (overall rating, floor, and
 * current noise). A bookmark button toggles the favorite state.
 *
 * @param space - The space to display.
 * @param name - The space's name.
 * @param categoryName - The resolved category name.
 * @param floorName - The resolved floor name.
 * @param amenities - Names of what the space offers (e.g. "Fireplace").
 * @param isFavorite - Whether the space is currently favorited.
 * @param onToggleFavorite - Called when the bookmark button is tapped.
 * @param onRate - Called when "Rate this space" is tapped.
 */
export function LandmarkCard({
  space,
  name,
  categoryName,
  floorName,
  amenities,
  isFavorite,
  onToggleFavorite,
  onRate,
}: LandmarkCardProps) {
  // Whether the expanded details section is shown.
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.hours}>{categoryName} · {floorName}</Text>
          </View>
          {/* Bookmark toggles favorite; filled + gold when favorited. */}
          <Pressable onPress={onToggleFavorite} hitSlop={8}>
            <Ionicons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isFavorite ? Colors.gold : Colors.textMuted}
            />
          </Pressable>
        </View>

        <Text style={styles.description}>{space.description}</Text>

        <CapacityMeter capacity={space.crowdRating} />

        {/* Show the current noise level as a tag. */}
        <View style={styles.tagRow}>
          <Chip label={`Noise: ${NoiseLabels[space.currentNoiseLevel]}`} />
        </View>

        {amenities.length > 0 ? (
          <View style={styles.amenities}>
            <Text style={styles.detailHeading}>What&apos;s here</Text>
            <View style={styles.tagRow}>
              {amenities.map((amenity) => (
                <Chip key={amenity} label={amenity} />
              ))}
            </View>
          </View>
        ) : null}

        <Pressable
          style={styles.rateButton}
          onPress={onRate}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${name}`}>
          <Ionicons name="star-outline" size={16} color={Colors.white} />
          <Text style={styles.rateButtonText}>Rate this space</Text>
        </Pressable>

        {/* Toggle button for the expanded details section. */}
        <Pressable
          style={styles.expandRow}
          onPress={() => setExpanded((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel={`${expanded ? 'Hide' : 'View'} details for ${name}`}>
          <Text style={styles.expandLabel}>{expanded ? 'Hide place details' : 'More about this place'}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.maroon} />
        </Pressable>

        {expanded ? (
          <View style={styles.detailsWrap}>
            <View style={styles.ratingRow}>
              <StarRating value={space.overallRating} readOnly size={16} />
              <Text style={styles.ratingText}>{space.overallRating.toFixed(1)} / 5</Text>
            </View>
            <Text style={styles.detailDescription}>{space.description}</Text>
            <Text style={styles.detailHeading}>Floor</Text>
            <Text style={styles.detailText}>{floorName}</Text>
            <Text style={styles.detailHeading}>Current noise</Text>
            <Text style={styles.detailText}>{NoiseLabels[space.currentNoiseLevel]}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.maroon,
    borderRadius: 12,
    paddingVertical: 10,
  },
  rateButtonText: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.white,
  },
  amenities: {
    gap: 6,
  },
  body: {
    padding: 14,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontFamily: Typography.bold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  hours: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  description: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  expandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  expandLabel: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.maroon,
  },
  detailsWrap: {
    gap: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  detailDescription: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  detailHeading: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  detailText: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  floorRow: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 10,
    gap: 2,
  },
  floorName: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  floorDescription: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  floorNoise: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
