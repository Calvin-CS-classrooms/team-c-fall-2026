import { useMemo, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

import { Colors, DensityColors, densityForCapacity } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface CapacitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const THUMB_SIZE = 24;

export function CapacitySlider({ value, onChange }: CapacitySliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_event, gesture) => {
          if (trackWidth <= 0) return;
          const startX = (value / 100) * trackWidth;
          const nextX = Math.min(Math.max(startX + gesture.dx, 0), trackWidth);
          const nextValue = Math.round((nextX / trackWidth) * 100);
          if (nextValue !== value) {
            onChange(nextValue);
          }
        },
        onPanResponderGrant: (event) => {
          if (trackWidth <= 0) return;
          const nextX = Math.min(Math.max(event.nativeEvent.locationX, 0), trackWidth);
          onChange(Math.round((nextX / trackWidth) * 100));
        },
      }),
    [value, trackWidth, onChange],
  );

  const color = DensityColors[densityForCapacity(value)];
  const thumbLeft = trackWidth > 0 ? (value / 100) * trackWidth - THUMB_SIZE / 2 : -THUMB_SIZE / 2;

  return (
    <View>
      <View
        style={styles.track}
        onLayout={(event) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
        {...panResponder.panHandlers}>
        <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
        <View style={[styles.thumb, { left: thumbLeft, borderColor: color }]} />
      </View>
      <View style={styles.labelsRow}>
        <Text style={styles.endLabel}>0% Empty</Text>
        <Text style={[styles.valueLabel, { color }]}>{value}%</Text>
        <Text style={styles.endLabel}>100% Maxed Out</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.white,
    borderWidth: 3,
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  endLabel: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  valueLabel: {
    fontFamily: Typography.bold,
    fontSize: 13,
  },
});
