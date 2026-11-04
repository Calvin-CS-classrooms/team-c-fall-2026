import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

/**
 * A 5-star rating display. In read-only mode it just shows the stars; in
 * interactive mode each star is tappable to set the rating.
 *
 * @param value - The current rating (0-5).
 * @param onChange - Optional handler called with the tapped star value.
 * @param size - Pixel size of each star icon.
 * @param readOnly - Whether the stars are non-interactive.
 */
export function StarRating({ value, onChange, size = 22, readOnly }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map((star) => {
        // A star is filled if its position is at or below the rounded value.
        const filled = star <= Math.round(value);
        if (readOnly) {
          return (
            <Ionicons
              key={star}
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={Colors.gold}
              style={styles.star}
            />
          );
        }
        return (
          <Pressable key={star} onPress={() => onChange?.(star)} hitSlop={6}>
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={Colors.gold}
              style={styles.star}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
});
