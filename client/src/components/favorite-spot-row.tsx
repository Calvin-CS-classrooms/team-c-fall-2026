import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import type { FavoriteSpot } from '@/types';

// Maps each location category to a matching icon for the row.
const CATEGORY_ICON: Record<FavoriteSpot['category'], keyof typeof Ionicons.glyphMap> = {
  study: 'book-outline',
  dining: 'restaurant-outline',
  athletics: 'barbell-outline',
  events: 'calendar-outline',
};

interface FavoriteSpotRowProps {
  favorite: FavoriteSpot;
  onRemove: () => void;
}

/**
 * A single row in the pinned favorite spots list on the profile screen.
 * Shows a category icon, the spot's name, and a remove button.
 *
 * @param favorite - The favorite spot to display.
 * @param onRemove - Called when the remove button is tapped.
 */
export function FavoriteSpotRow({ favorite, onRemove }: FavoriteSpotRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Ionicons name={CATEGORY_ICON[favorite.category]} size={16} color={Colors.maroon} />
      </View>
      <Text style={styles.name}>{favorite.name}</Text>
      {/* Remove button; hitSlop enlarges its tap target. */}
      <Pressable onPress={onRemove} hitSlop={8}>
        <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
});
