import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopHeader } from '../components/TopHeader';
import { CAMPUS_LOCATIONS, CampusLocation } from '../data/mockData';
import { colors } from '../theme';

interface UserProfileScreenProps {
  onBack: () => void;
  onSelectLocation: (loc: CampusLocation) => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  onBack,
  onSelectLocation,
}) => {
  const stats = [
    { value: '7', label: 'Reviews Posted', color: colors.maroon },
    { value: '4', label: 'Spots Verified', color: colors.green },
    { value: '89', label: 'Helpful Votes', color: colors.gold },
  ];

  const savedSpots = [
    { loc: CAMPUS_LOCATIONS[0], subtitle: '2nd Floor Quiet Zone' },
    { loc: CAMPUS_LOCATIONS[2], subtitle: '3rd Floor Solarium' },
  ];

  const badges = [
    { icon: 'nightlight' as const, color: colors.maroon, bg: colors.maroonLight, title: 'Night Owl', desc: 'Rated spots after 9 PM' },
    { icon: 'volume-off' as const, color: colors.green, bg: colors.greenLight, title: 'Silence Scout', desc: 'Calibrated quiet zones' },
  ];

  return (
    <View style={styles.container}>
      <TopHeader
        type="subscreen"
        title="Knight Profile"
        onBack={onBack}
        rightBadgeType="initial"
      />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {/* Profile Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>C</Text>
          </View>
          <Text style={styles.name}>Calvin Student</Text>
          <Text style={styles.email}>calvin.edu • Class of '26</Text>

          <View style={styles.badgeRow}>
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={15} color={colors.green} />
              <Text style={styles.verifiedBadgeText}>Verified Contributor</Text>
            </View>
            <View style={styles.pointsBadge}>
              <MaterialIcons name="stars" size={15} color="#7f5700" />
              <Text style={styles.pointsBadgeText}>345 Scout Pts</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statTile}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Saved Study Spots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Study Spots</Text>
            <Text style={styles.sectionCount}>2 saved</Text>
          </View>

          <View style={styles.savedList}>
            {savedSpots.map(({ loc, subtitle }) => (
              <TouchableOpacity
                key={loc.id}
                onPress={() => onSelectLocation(loc)}
                style={styles.savedCard}
              >
                <View style={styles.savedLeft}>
                  <Image source={{ uri: loc.image }} style={styles.savedImage} />
                  <View>
                    <Text style={styles.savedName}>{loc.name}</Text>
                    <Text style={styles.savedSubtitle}>{subtitle}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.subtext3} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Scout Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scout Badges</Text>
          <View style={styles.badgesGrid}>
            {badges.map((b) => (
              <View key={b.title} style={styles.badgeCard}>
                <View style={[styles.badgeIcon, { backgroundColor: b.bg }]}>
                  <MaterialIcons name={b.icon} size={20} color={b.color} />
                </View>
                <View>
                  <Text style={styles.badgeTitle}>{b.title}</Text>
                  <Text style={styles.badgeDesc}>{b.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.black,
  },
  email: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,222,174,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(253,186,69,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7f5700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  statTile: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionCount: {
    fontSize: 12,
    color: colors.maroon,
    fontWeight: '600',
  },
  savedList: {
    gap: 10,
  },
  savedCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  savedName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
  },
  savedSubtitle: {
    fontSize: 12,
    color: colors.mutedText,
  },
  badgesGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.black,
  },
  badgeDesc: {
    fontSize: 11,
    color: colors.mutedText,
  },
});

