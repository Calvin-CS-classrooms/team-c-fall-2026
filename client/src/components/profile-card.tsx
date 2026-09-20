import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { VerifiedBadge } from '@/components/verified-badge';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface ProfileCardProps {
  name: string;
  email: string;
}

export function ProfileCard({ name, email }: ProfileCardProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.card}>
      <Image source={require('@/assets/images/calvin_logo.webp')} style={styles.watermark} contentFit="contain" />
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <VerifiedBadge label="calvin.edu SSO Verified" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.maroon,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 120,
    height: 120,
    opacity: 0.12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontFamily: Typography.extraBold,
    fontSize: 22,
    color: Colors.maroonDark,
  },
  name: {
    fontFamily: Typography.extraBold,
    fontSize: 18,
    color: Colors.white,
  },
  email: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.goldSoft,
    marginBottom: 6,
  },
});
