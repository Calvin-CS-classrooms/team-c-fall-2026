import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { FavoriteSpotRow } from '@/components/favorite-spot-row';
import { ProfileCard } from '@/components/profile-card';
import { SettingToggleRow } from '@/components/setting-toggle-row';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { isCalvinEmail } from '@/utils/verification';

export function ProfileScreen() {
  const { favorites, removeFavorite, settings, toggleSetting, calvinEmail, setCalvinEmail } = useAppData();
  const [emailInput, setEmailInput] = useState(calvinEmail ?? '');
  const [emailError, setEmailError] = useState('');
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader title="Profile" subtitle="Manage your account & preferences" />

        <View style={styles.section}>
          <ProfileCard 
            name="Calvin Student"
            email={calvinEmail ?? 'No Calvin email added'}
          />
        </View>
      

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calvin Email</Text>

          <TextInput
            placeholder="Enter your Calvin email"
            value={emailInput}
            onChangeText={setEmailInput}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: Colors.maroonDark,
              borderRadius: 8,
              padding: 12,
              color: Colors.maroonDark,
            }}
          />

          <Button
            title="Save Calvin Email"
            onPress={() => {
              if (isCalvinEmail(emailInput)) {
                setCalvinEmail(emailInput.trim().toLowerCase());
                setEmailError('');
              } else {
                setCalvinEmail(null);
                setEmailError('Please enter a valid @calvin.edu email.');
              }
           }}
        />

        {emailError ? <Text>{emailError}</Text> : null}

        {calvinEmail ? (
          <Text>Calvin email added: {calvinEmail}</Text>
        ) : null}
      </View>

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
              subtitle="Hide your name on submitted ratings"
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
  emptyText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
