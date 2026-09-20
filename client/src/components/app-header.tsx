import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  leftAccessory?: React.ReactNode;
}

export function AppHeader({ title, subtitle, leftAccessory }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {leftAccessory}
      </View>
      <Image
        source={require('@/assets/images/calvin_logo.webp')}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="Calvin University shield logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: Colors.background,
  },
  left: {
    flex: 1,
    gap: 4,
    paddingRight: 12,
  },
  title: {
    fontFamily: Typography.extraBold,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  logo: {
    width: 42,
    height: 42,
    marginTop: 2,
  },
});
