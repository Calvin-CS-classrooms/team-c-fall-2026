import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 22, readOnly }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map((star) => {
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
