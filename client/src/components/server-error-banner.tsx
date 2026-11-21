import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface ServerErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

/**
 * A dismissible banner shown when a change could not be saved to the server.
 * The change has already been reverted locally, so this tells the user why
 * their action did not stick.
 *
 * @param message - The error message to show.
 * @param onDismiss - Called when the banner is dismissed.
 */
export function ServerErrorBanner({ message, onDismiss }: ServerErrorBannerProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Ionicons name="alert-circle" size={18} color={Colors.danger} />
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={onDismiss} hitSlop={8} accessibilityRole="button" accessibilityLabel="Dismiss error">
        <Ionicons name="close" size={18} color={Colors.danger} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FBEAEA',
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 12,
  },
  message: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.danger,
  },
});
