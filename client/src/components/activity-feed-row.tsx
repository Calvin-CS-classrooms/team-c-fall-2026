import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, NoiseLabels } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { formatMinutesAgo } from '@/utils/format';
import type { ActivityFeedItem } from '@/types';

const NOISE_ICON: Record<ActivityFeedItem['noise'], keyof typeof Ionicons.glyphMap> = {
  whisper: 'volume-mute',
  'low-buzz': 'volume-low',
  social: 'volume-medium',
  loud: 'volume-high',
};

export function ActivityFeedRow({ item }: { item: ActivityFeedItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Ionicons name={NOISE_ICON[item.noise]} size={16} color={Colors.maroon} />
      </View>
      <View style={styles.content}>
        <Text style={styles.location}>{item.locationName}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{NoiseLabels[item.noise]}</Text>
          {item.waitMinutes ? <Text style={styles.meta}>· {item.waitMinutes} min wait</Text> : null}
          <Text style={styles.meta}>· {formatMinutesAgo(item.minutesAgo)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
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
  content: {
    flex: 1,
    gap: 2,
  },
  location: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  message: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  meta: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
});
