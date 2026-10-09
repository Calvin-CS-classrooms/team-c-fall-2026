import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CapacityMeter } from '@/components/capacity-meter';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import type { CampusLocation } from '@/types';

interface LocationCardProps {
  location: CampusLocation;
  onPress?: () => void;
}

export function LocationCard({ location, onPress }: LocationCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={location.image} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {location.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={Colors.gold} />
            <Text style={styles.ratingText}>{location.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.hours} numberOfLines={1}>
          {location.isOpenNow ? 'Open now' : 'Closed'} · {location.hoursLabel}
        </Text>
        <CapacityMeter capacity={location.capacity} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
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
