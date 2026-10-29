import { Ionicons } from '@expo/vector-icons';
import type { PropsWithChildren } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
}

/**
 * A modal bottom sheet that slides up from the bottom of the screen.
 * Tapping the dimmed overlay or the close button dismisses it. The sheet
 * is padded by the safe-area inset so content clears the home indicator.
 * This is currently only used to submit a "quick rating" on the home screen
 * when you tap on the GPS banner.
 *
 * @param visible - Whether the sheet is shown.
 * @param onClose - Called when the user dismisses the sheet.
 * @param title - Heading shown at the top of the sheet.
 * @param children - Content rendered inside the scrollable sheet body.
 */
export function BottomSheet({ visible, onClose, title, children }: PropsWithChildren<BottomSheetProps>) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Full-screen pressable behind the sheet: tapping the dimmed
            backdrop dismisses the sheet. */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.grabber} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(36, 26, 26, 0.45)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '88%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.bold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
});
