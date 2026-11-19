import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  /**
   * When false, only draws the switch and handles no presses, for use inside
   * a larger pressable row that is itself announced as the switch.
   */
  interactive?: boolean;
}

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const KNOB_SIZE = 20;
const KNOB_INSET = (TRACK_HEIGHT - KNOB_SIZE) / 2;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - KNOB_INSET * 2;

/**
 * A flat on/off switch that looks the same on web, iOS and Android.
 *
 * React Native's Switch is rendered differently on the web: the knob turns
 * teal when on, is larger than the track, and carries a heavy drop shadow,
 * so toggling looked raised and bouncy. This switch keeps a white knob
 * inside a maroon (on) or grey (off) track and slides it with a short eased
 * animation, with no overshoot.
 *
 * @param value - Whether the switch is on.
 * @param onValueChange - Called with the new value when pressed.
 * @param disabled - Ignore presses and dim the switch.
 * @param accessibilityLabel - What the switch controls, read by screen readers.
 * @param interactive - Set false when a parent row handles the press.
 */
export function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  interactive = true,
}: ToggleSwitchProps) {
  // Animates from 0 (off) to 1 (on). Created once and kept for the switch's lifetime.
  const [position] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(position, {
      toValue: value ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      // The native driver is not available on the web.
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [position, value]);

  const track = (
    <Animated.View testID="toggle-track" style={[styles.track, { backgroundColor: value ? Colors.maroon : Colors.border }]}>
      <Animated.View
        testID="toggle-knob"
        style={[
          styles.knob,
          { transform: [{ translateX: position.interpolate({ inputRange: [0, 1], outputRange: [0, KNOB_TRAVEL] }) }] },
        ]}
      />
    </Animated.View>
  );

  if (!interactive) {
    return (
      <View style={disabled ? styles.disabled : undefined} importantForAccessibility="no-hide-descendants" accessible={false}>
        {track}
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        if (!disabled) onValueChange(!value);
      }}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      style={disabled ? styles.disabled : undefined}>
      {track}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: KNOB_INSET,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: Colors.white,
  },
  disabled: {
    opacity: 0.5,
  },
});
