import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  disabled?: boolean;
}

/**
 * A pill-shaped selectable button, used for filter chips (e.g. noise
 * levels, amenities, categories). Shows an optional icon and label, and
 * changes appearance when selected, pressed, or disabled.
 *
 * @param label - Text shown on the chip.
 * @param selected - Whether the chip is in its selected (highlighted) state.
 * @param onPress - Called when the chip is tapped.
 * @param icon - Optional icon shown before the label.
 * @param disabled - Whether the chip is non-interactive.
 */
export function Chip({ label, selected, onPress, icon, disabled }: ChipProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      // Style array: base chip style, plus conditional styles for the
      // selected, pressed, and disabled states.
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <View style={styles.content}>
        {icon ? <Ionicons name={icon} size={14} color={selected ? Colors.white : Colors.textSecondary} /> : null}
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
