import { Image, type ImageProps } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CapacityMeter } from '@/components/capacity-meter';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import type { Space } from '@/types';

interface LocationCardProps {
  space: Space;
  name: string;
  image?: ImageProps['source'];
  width?: number | `${number}%`;
  onPress?: () => void;
}

/**
 * A compact card used in the home screen's "Popular On-Campus Today"
 * carousel. Shows a space's image, name, rating, and a capacity meter.
 * The whole card is tappable. However, currently no action is taken when
 * tapping a card.
 *
 * @param space - The space to display.
 * @param name - The resolved name of the space's location.
 * @param image - The location's image source. Falls back to a placeholder
 *   showing the name when not provided.
 * @param width - Card width. Defaults to 220 (carousel); pass '100%' to fill
 *   the container (e.g. in a vertical list).
 * @param onPress - Optional handler called when the card is tapped.
 */
export function LocationCard({ space, name, image, width = 220, onPress }: LocationCardProps) {
  const imageSource = image ?? { uri: `https://placehold.co/400x200?text=${encodeURIComponent(name)}` };

  return (
    // Slight opacity dim while pressed gives tactile feedback.
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}>
      <Image source={imageSource} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          {/* numberOfLines truncates long names to a single line. */}
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={Colors.gold} />
            <Text style={styles.ratingText}>{space.overallRating.toFixed(1)}</Text>
          </View>
        </View>
        <CapacityMeter capacity={space.crowdRating} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.surfaceAlt,
  },
  body: {
    padding: 12,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  hours: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
