import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CapacityMeter } from '@/components/capacity-meter';
import { Chip } from '@/components/chip';
import { StarRating } from '@/components/star-rating';
import { Colors, NoiseLabels } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import type { CampusLocation } from '@/types';

interface LandmarkCardProps {
  location: CampusLocation;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * A card in the explore screen's landmark directory. Shows a location's
 * image, name, open/closed status, description, capacity, and tags. An
 * expandable section reveals more details (rating, amenities, wait time,
 * and a floor-by-floor guide). A bookmark button toggles the favorite state.
 *
 * @param location - The campus location to display.
 * @param isFavorite - Whether the location is currently favorited.
 * @param onToggleFavorite - Called when the bookmark button is tapped.
 */
export function LandmarkCard({ location, isFavorite, onToggleFavorite }: LandmarkCardProps) {
  // Whether the expanded details section is shown.
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Image source={location.image} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{location.name}</Text>
            <Text style={styles.hours}>{location.isOpenNow ? 'Open now' : 'Closed'} · {location.hoursLabel}</Text>
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

        <Text style={styles.description}>{location.shortDescription}</Text>

        <CapacityMeter capacity={location.capacity} />

        {/* Show the noise level plus the first 3 amenities as tags. */}
        <View style={styles.tagRow}>
          <Chip label={`Noise: ${NoiseLabels[location.noise]}`} />
          {location.amenities.slice(0, 3).map((amenity) => (
            <Chip key={amenity} label={amenity} />
          ))}
        </View>

        {/* Toggle button for the expanded details section. */}
        <Pressable
          style={styles.expandRow}
          onPress={() => setExpanded((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel={`${expanded ? 'Hide' : 'View'} details for ${location.name}`}>
          <Text style={styles.expandLabel}>{expanded ? 'Hide place details' : 'More about this place'}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.maroon} />
        </Pressable>

        {expanded ? (
          <View style={styles.detailsWrap}>
            <View style={styles.ratingRow}>
              <StarRating value={location.rating} readOnly size={16} />
              <Text style={styles.ratingText}>{location.rating.toFixed(1)} / 5</Text>
            </View>
            <Text style={styles.detailDescription}>{location.shortDescription}</Text>
            <Text style={styles.detailHeading}>Amenities</Text>
            <View style={styles.tagRow}>
              {location.amenities.map((amenity) => (
                <Chip key={amenity} label={amenity} />
              ))}
            </View>
            {/* Wait time is optional, so only render it when present. */}
            {location.waitTimeMinutes !== undefined ? (
              <Text style={styles.detailText}>Typical wait: {location.waitTimeMinutes} min</Text>
            ) : null}
            <Text style={styles.detailHeading}>Floor-by-floor guide</Text>
            {location.floors.map((floor) => (
              <View key={floor.floor} style={styles.floorRow}>
                <Text style={styles.floorName}>{floor.floor}</Text>
                <Text style={styles.floorDescription}>{floor.description}</Text>
                <Text style={styles.floorNoise}>Expected noise: {NoiseLabels[floor.noise]}</Text>
              </View>
            ))}
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
  image: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.surfaceAlt,
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
