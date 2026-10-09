import { StyleSheet, Text, View } from 'react-native';

import { Colors, DensityColors, DensityLabels } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import type { DensityLevel } from '@/types';

interface DensityOverviewCardProps {
  overallDensity: DensityLevel;
  breakdown: { category: string; density: DensityLevel }[];
}

export function DensityOverviewCard({ overallDensity, breakdown }: DensityOverviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Campus Density Right Now</Text>
        <View style={[styles.badge, { backgroundColor: DensityColors[overallDensity] }]}>
          <Text style={styles.badgeText}>{DensityLabels[overallDensity]}</Text>
        </View>
      </View>
      <View style={styles.breakdownRow}>
        {breakdown.map((item) => (
          <View key={item.category} style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: DensityColors[item.density] }]} />
            <Text style={styles.breakdownLabel}>{item.category}</Text>
            <Text style={[styles.breakdownValue, { color: DensityColors[item.density] }]}>
              {DensityLabels[item.density]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: Typography.bold,
    fontSize: 12,
    color: Colors.white,
  },
  breakdownRow: {
    gap: 10,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  breakdownValue: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
  },
});
