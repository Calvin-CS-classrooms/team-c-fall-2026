import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

/**
 * A small pill badge with a checkmark icon and label, used to indicate a
 * verified status (e.g. a verified @calvin.edu email).
 *
 * @param label - Text shown next to the checkmark.
 */
export function VerifiedBadge({ label = 'Verified' }: { label?: string }) {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={14} color={Colors.gold} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.maroonDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  label: {
    color: Colors.white,
    fontSize: 11,
    fontFamily: Typography.semiBold,
  },
});
