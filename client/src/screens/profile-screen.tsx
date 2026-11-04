import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { AppHeader } from '@/components/app-header';
import { FavoriteSpotRow } from '@/components/favorite-spot-row';
import { ProfileCard } from '@/components/profile-card';
import { SettingToggleRow } from '@/components/setting-toggle-row';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { confirmAction } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

/**
 * Profile screen: shows the logged-in user's account info, account deletion
 * status, preference toggles (geolocation, anonymous mode, capacity alerts),
 * pinned favorite spots, and log out / delete account buttons.
 */
export function ProfileScreen() {
  const {
    account,
    logOut,
    requestAccountDeletion,
    cancelAccountDeletion,
    finalizeAccountDeletion,
    favorites,
    removeFavorite,
    settings,
    toggleSetting,
  } = useAppData();
  const handleRequestDeletion = () => {
    confirmAction({
      title: 'Delete your account?',
      message:
        'Your account will be permanently deleted in one week, so you have time to change your mind. ' +
        'Your ratings will stay up but will show as "Anonymous user".',
      confirmLabel: 'Schedule deletion',
      onConfirm: requestAccountDeletion,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader title="Profile" subtitle="Manage your account & preferences" />

        {account ? (
          <View style={styles.section}>
            <ProfileCard name={account.name} email={account.email} />
          </View>
        ) : null}

        {account?.deletionScheduledFor ? (
          <View style={styles.section}>
            <View style={styles.deletionBanner}>
              <View style={styles.deletionHeader}>
                <Ionicons name="time-outline" size={18} color={Colors.danger} />
                <Text style={styles.deletionTitle}>Deletion scheduled</Text>
              </View>
              <Text style={styles.deletionText}>
                Your account will be permanently deleted on {formatDate(account.deletionScheduledFor)}. Your ratings
                will remain and show as &quot;Anonymous user&quot;.
              </Text>
              <ActionButton label="Keep My Account" variant="outline" onPress={cancelAccountDeletion} />
              <ActionButton label="Demo: finish deletion now" variant="ghost" onPress={finalizeAccountDeletion} />
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingToggleRow
              icon="navigate-outline"
              title="Geolocation"
              subtitle="Detect your current campus location"
              value={settings.geolocation}
              onValueChange={() => toggleSetting('geolocation')}
            />
            <SettingToggleRow
              icon="eye-off-outline"
              title="Anonymous Mode"
              subtitle="Ratings you submit while on show as Anonymous user"
              value={settings.anonymousMode}
              onValueChange={() => toggleSetting('anonymousMode')}
            />
            <SettingToggleRow
              icon="notifications-outline"
              title="Capacity Push Alerts"
              subtitle="Get notified when your favorite spots open up"
              value={settings.capacityAlerts}
              onValueChange={() => toggleSetting('capacityAlerts')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pinned Favorite Spots</Text>
          <View style={styles.card}>
            {favorites.map((favorite) => (
              <FavoriteSpotRow
                key={favorite.locationId}
                favorite={favorite}
                onRemove={() => removeFavorite(favorite.locationId)}
              />
            ))}
            {favorites.length === 0 ? (
              <Text style={styles.emptyText}>Pin spots from Explore to see them here.</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <ActionButton label="Log Out" variant="outline" icon="log-out-outline" onPress={logOut} />
          {account && !account.deletionScheduledFor ? (
            <ActionButton label="Delete Account" variant="danger" icon="trash-outline" onPress={handleRequestDeletion} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  deletionBanner: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.danger,
    padding: 16,
    gap: 10,
  },
  deletionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deletionTitle: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.danger,
  },
  deletionText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
