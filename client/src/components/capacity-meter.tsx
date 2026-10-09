import { StyleSheet, Text, View } from 'react-native';

import { Colors, DensityColors, densityForCapacity, DensityLabels } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface CapacityMeterProps {
  capacity: number;
  showLabel?: boolean;
}

export function CapacityMeter({ capacity, showLabel = true }: CapacityMeterProps) {
  const density = densityForCapacity(capacity);
  const color = DensityColors[density];

  return (
    <View>
      <View style={styles.track}>
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
