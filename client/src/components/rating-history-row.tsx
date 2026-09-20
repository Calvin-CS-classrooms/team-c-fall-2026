import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, NoiseLabels } from '@/constants/colors';
import { StarRating } from '@/components/star-rating';
import { Typography } from '@/constants/typography';
import { formatMinutesAgo } from '@/utils/format';
import type { UserRating } from '@/types';

interface RatingHistoryRowProps {
  rating: UserRating;
  onMarkHelpful: () => void;
  onDelete: () => void;
}

export function RatingHistoryRow({ rating, onMarkHelpful, onDelete }: RatingHistoryRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.location}>{rating.locationName}</Text>
        <Pressable onPress={onDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </Pressable>
      </View>

      <StarRating value={rating.stars} readOnly size={16} />

      {rating.comment ? <Text style={styles.comment}>{rating.comment}</Text> : null}

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{rating.capacity}% busy</Text>
        <Text style={styles.meta}>· {NoiseLabels[rating.noise]}</Text>
        <Text style={styles.meta}>· {formatMinutesAgo(rating.createdMinutesAgo)}</Text>
      </View>

      <Pressable style={styles.helpfulButton} onPress={onMarkHelpful}>
        <Ionicons name="thumbs-up-outline" size={14} color={Colors.maroon} />
        <Text style={styles.helpfulText}>Helpful ({rating.helpfulCount})</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  comment: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 4,
  },
  meta: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 4,
  },
  helpfulText: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.maroon,
  },
});
