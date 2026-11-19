import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ToggleSwitch } from '@/components/toggle-switch';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface SettingToggleRowProps {
  icon: IconName;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/**
 * A single preference row on the profile screen: an icon, a title and
 * subtitle, and a toggle switch bound to a boolean setting. The whole row is
 * the switch, so tapping anywhere on it toggles the setting.
 *
 * @param icon - Icon shown on the left.
 * @param title - The setting's name.
 * @param subtitle - Short description of the setting.
 * @param value - Current on/off state of the switch.
 * @param onValueChange - Called with the new state when toggled.
 */
export function SettingToggleRow({ icon, title, subtitle, value, onValueChange }: SettingToggleRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ checked: value }}
      // The web reads aria-checked rather than accessibilityState.
      aria-checked={value}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={Colors.maroon} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {/* Drawn only; the row above handles the press and is announced as the switch. */}
      <ToggleSwitch value={value} onValueChange={onValueChange} interactive={false} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
