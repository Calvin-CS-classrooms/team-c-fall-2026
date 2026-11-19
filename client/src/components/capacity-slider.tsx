import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type AccessibilityActionEvent, type GestureResponderEvent } from 'react-native';

import { Colors, DensityColors, DensityLabels, densityForCapacity } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { stepValue, valueFromDrag, valueFromPosition } from '@/utils/slider';

interface CapacitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const THUMB_SIZE = 26;
// The touchable area is taller than the 8px track so it is easy to grab.
const TOUCH_HEIGHT = 44;

/**
 * A slider for choosing how crowded a place is (0-100%).
 *
 * Tap anywhere on the bar to jump there, or drag the thumb. Values snap to
 * 5% steps. The label shows the value with its crowd level ("40% · Moderate"),
 * and the fill colour matches that level. Screen-reader users can swipe up
 * or down to change it by 5%.
 *
 * @param value - Current crowd percentage (0-100).
 * @param onChange - Called with the new value when the user changes it.
 */
export function CapacitySlider({ value, onChange }: CapacitySliderProps) {
  // Measured width of the bar, used to turn pixel positions into percentages.
  const [trackWidth, setTrackWidth] = useState(0);
  // Where the current drag began: the page x of the touch and the value at
  // that moment. Drag distance is measured from there, so it must be added to
  // the starting value, not the latest one (that made the thumb run ahead).
  const drag = useRef({ startPageX: 0, startValue: value });

  const update = (next: number | undefined) => {
    if (next !== undefined && next !== value) onChange(next);
  };

  // Touch down: jump to the touched spot. The fill and thumb ignore touches
  // (pointerEvents="none"), so locationX is always measured from the left
  // edge of the bar, not from whatever element was under the finger.
  const onGrant = (event: GestureResponderEvent) => {
    const next = valueFromPosition(event.nativeEvent.locationX, trackWidth);
    drag.current = { startPageX: event.nativeEvent.pageX, startValue: next ?? value };
    update(next);
  };

  const onMove = (event: GestureResponderEvent) => {
    const dx = event.nativeEvent.pageX - drag.current.startPageX;
    update(valueFromDrag(drag.current.startValue, dx, trackWidth));
  };

  const density = densityForCapacity(value);
  const color = DensityColors[density];
  const label = DensityLabels[density];
  // Centre the thumb on the value. Before the bar is measured, keep it at the start.
  const thumbLeft = trackWidth > 0 ? (value / 100) * trackWidth - THUMB_SIZE / 2 : -THUMB_SIZE / 2;

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === 'increment') update(stepValue(value, 1));
    if (event.nativeEvent.actionName === 'decrement') update(stepValue(value, -1));
  };

  return (
    <View>
      <View style={styles.valueRow}>
        <Text style={[styles.valueLabel, { color }]}>{`${value}% · ${label}`}</Text>
      </View>
      <View
        style={styles.touchArea}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Crowd rating"
        accessibilityValue={{ min: 0, max: 100, now: value, text: `${value}%, ${label}` }}
        // The web reads aria-value* props rather than accessibilityValue.
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}%, ${label}`}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={onAccessibilityAction}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={onGrant}
        onResponderMove={onMove}
        // Don't let a surrounding ScrollView take over once dragging has started.
        onResponderTerminationRequest={() => false}>
        <View style={styles.track} pointerEvents="none">
          <View testID="slider-fill" pointerEvents="none" style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
        </View>
        <View
          testID="slider-thumb"
          pointerEvents="none"
          style={[styles.thumb, { left: thumbLeft, borderColor: color }]}
        />
      </View>
      <View style={styles.labelsRow}>
        <Text style={styles.endLabel}>Empty</Text>
        <Text style={styles.endLabel}>Packed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  valueRow: {
    alignItems: 'center',
    marginBottom: 2,
  },
  valueLabel: {
    fontFamily: Typography.bold,
    fontSize: 14,
  },
  touchArea: {
    height: TOUCH_HEIGHT,
    justifyContent: 'center',
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  thumb: {
    position: 'absolute',
    top: (TOUCH_HEIGHT - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.white,
    borderWidth: 3,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  endLabel: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
});
