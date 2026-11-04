import { StyleSheet, Text, View } from 'react-native';

import { Colors, DensityColors, densityForCapacity, DensityLabels } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface CapacityMeterProps {
  capacity: number;
  showLabel?: boolean;
}

/**
 * A horizontal bar that visualizes a place's capacity as a percentage.
 * The fill width and color are derived from the capacity value, and an
 * optional label row shows the density label and "% busy" text.
 *
 * @param capacity - Capacity as a percentage (0-100).
 * @param showLabel - Whether to show the density/percent labels below the bar.
 */
export function CapacityMeter({ capacity, showLabel = true }: CapacityMeterProps) {
  // Derive the density level and its color from the capacity percentage.
  const density = densityForCapacity(capacity);
  const color = DensityColors[density];

  return (
    <View>
      <View style={styles.track}>
        {/* Fill width is the capacity percentage; color reflects density. */}
        <View style={[styles.fill, { width: `${capacity}%`, backgroundColor: color }]} />
      </View>
      {showLabel ? (
        <View style={styles.labelRow}>
          <Text style={[styles.densityLabel, { color }]}>{DensityLabels[density]}</Text>
          <Text style={styles.percentLabel}>{capacity}% busy</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  densityLabel: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
  },
  percentLabel: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
