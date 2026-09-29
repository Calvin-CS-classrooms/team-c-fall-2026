import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';

// A small pill/badge with optional icon
export const Pill: React.FC<{
  label: string;
  bg?: string;
  borderColor?: string;
  textColor?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  style?: ViewStyle;
}> = ({ label, bg = colors.white, borderColor = colors.border, textColor = colors.text, icon, iconColor, style }) => {
  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor }, style]}>
      {icon && <MaterialIcons name={icon} size={14} color={iconColor || textColor} />}
      <Text style={[styles.pillText, { color: textColor }]}>{label}</Text>
    </View>
  );
};

// A live status dot with optional pulse
export const LiveDot: React.FC<{ color?: string; size?: number }> = ({ color = colors.green, size = 8 }) => {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
};

// Star rating display (read-only)
export const StarRating: React.FC<{ rating: number; size?: number; color?: string }> = ({
  rating,
  size = 14,
  color = colors.star,
}) => {
  return (
    <View style={styles.starRow}>
      <MaterialIcons name="star" size={size} color={color} />
      <Text style={[styles.starText, { fontSize: size * 0.9 }]}>{rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starText: {
    fontWeight: '700',
    color: colors.text,
  },
});
