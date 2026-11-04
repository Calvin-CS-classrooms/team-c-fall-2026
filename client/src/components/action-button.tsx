import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Variant = 'primary' | 'danger' | 'outline' | 'ghost';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  disabled?: boolean;
}

const TEXT_COLORS: Record<Variant, string> = {
  primary: Colors.white,
  danger: Colors.white,
  outline: Colors.maroon,
  ghost: Colors.textSecondary,
};

export function ActionButton({ label, onPress, variant = 'primary', icon, disabled }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}>
      {icon ? <Ionicons name={icon} size={16} color={TEXT_COLORS[variant]} /> : null}
      <Text style={[styles.label, { color: TEXT_COLORS[variant] }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: Colors.maroon,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.maroon,
    backgroundColor: Colors.surface,
  },
  ghost: {
    paddingVertical: 8,
  },
  label: {
    fontFamily: Typography.bold,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.4,
  },
});
