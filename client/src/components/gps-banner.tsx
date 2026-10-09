import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface GpsBannerProps {
  locationLabel: string;
  onPress: () => void;
}

export function GpsBanner({ locationLabel, onPress }: GpsBannerProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Ionicons name="location" size={18} color={Colors.white} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>Rate your current location</Text>
        <Text style={styles.subtitle}>{locationLabel}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.maroon,
    borderRadius: 16,
    padding: 14,
  },
  pressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.maroonSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.goldSoft,
  },
  subtitle: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.white,
    marginTop: 1,
  },
});
