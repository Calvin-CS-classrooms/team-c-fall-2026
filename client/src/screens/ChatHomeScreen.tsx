import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopHeader } from '../components/TopHeader';
import { LiveDot } from '../components/ui';
import { CAMPUS_LOCATIONS, CampusLocation } from '../data/mockData';
import { colors } from '../theme';

interface ChatHomeScreenProps {
  onAskQuestion: (query: string) => void;
  onOpenProfile: () => void;
  onSelectLocation: (loc: CampusLocation) => void;
}

export const ChatHomeScreen: React.FC<ChatHomeScreenProps> = ({
  onAskQuestion,
  onOpenProfile,
  onSelectLocation,
}) => {
  const [inputText, setInputText] = useState('');

  const defaultQuestion = 'Where is the best place to study on campus at 7 PM?';

  const handleSubmit = () => {
    if (inputText.trim()) {
      onAskQuestion(inputText.trim());
    } else {
      onAskQuestion(defaultQuestion);
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader type="feed" onProfileClick={onOpenProfile} />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {/* Live campus status badge */}
        <View style={styles.statusRow}>
          <View style={[styles.badge, styles.liveBadge]}>
            <LiveDot />
            <Text style={styles.liveBadgeText}>Live Campus Insights</Text>
          </View>
          <View style={[styles.badge, styles.timeBadge]}>
            <MaterialIcons name="schedule" size={14} color={colors.subtext2} />
            <Text style={styles.timeBadgeText}>7:02 PM • Tue</Text>
          </View>
        </View>

        {/* Hero Welcome */}
        <View style={styles.hero}>
          <View style={styles.heroTitleRow}>
            <MaterialIcons name="auto-awesome" size={20} color={colors.maroon} />
            <Text style={styles.heroEyebrow}>Calvin Campus Scout</Text>
          </View>
          <Text style={styles.heroTitle}>Ask about places on campus</Text>
          <Text style={styles.heroSubtitle}>
            Real-time noise meters, seat availability, outlet counts, and coffee lines curated by Calvin Knights.
          </Text>
        </View>

        {/* Popular Question Card */}
        <View style={styles.suggestSection}>
          <Text style={styles.sectionLabel}>Suggested Recommendation</Text>
          <TouchableOpacity
            onPress={() => onAskQuestion(defaultQuestion)}
            style={styles.suggestCard}
          >
            <View style={styles.suggestCardInner}>
              <View style={styles.suggestIcon}>
                <MaterialIcons name="chat-bubble" size={20} color={colors.maroon} />
              </View>
              <View style={styles.suggestTextWrap}>
                <Text style={styles.suggestTitle}>{defaultQuestion}</Text>
                <View style={styles.suggestMeta}>
                  <LiveDot size={6} />
                  <Text style={styles.suggestMetaText}>
                    Checks quiet floors, AC outlets, and late hours
                  </Text>
                </View>
              </View>
              <MaterialIcons name="arrow-forward" size={20} color={colors.subtext3} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Input Form */}
        <View style={styles.inputWrap}>
          <View style={styles.inputBox}>
            <MaterialIcons name="search" size={20} color={colors.subtext3} />
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask Calvin Ratings..."
              placeholderTextColor={colors.lightText}
              style={styles.input}
              onSubmitEditing={handleSubmit}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.sendBtn}>
              <MaterialIcons name="send" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Tiles */}
        <View style={styles.tilesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <Text style={styles.sectionCount}>{CAMPUS_LOCATIONS.length} spots</Text>
          </View>

          <View style={styles.tilesList}>
            {CAMPUS_LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                onPress={() => onSelectLocation(loc)}
                style={styles.tile}
                activeOpacity={0.9}
              >
                {/* Picture-focused tile */}
                <View style={styles.tileImageWrap}>
                  <Image source={{ uri: loc.image }} style={styles.tileImage} />
                  <View style={styles.tileOverlay} />

                  {/* Status pill */}
                  <View style={styles.tileStatusPill}>
                    <View style={[styles.tileStatusDot, { backgroundColor: loc.statusDotColor }]} />
                    <Text style={[styles.tileStatusText, { color: loc.statusColor }]}>
                      {loc.statusTag}
                    </Text>
                  </View>

                  {/* Rating pill */}
                  <View style={styles.tileRatingPill}>
                    <MaterialIcons name="star" size={14} color={colors.star} />
                    <Text style={styles.tileRatingText}>{loc.rating}</Text>
                    <Text style={styles.tileRatingCount}>({loc.reviewCount})</Text>
                  </View>

                  {/* Bottom info over image */}
                  <View style={styles.tileBottom}>
                    <Text style={styles.tileName}>{loc.name}</Text>
                    <Text style={styles.tileSubtitle} numberOfLines={1}>
                      {loc.subtitle}
                    </Text>
                    <View style={styles.tileMetaRow}>
                      <View style={styles.tileMetaItem}>
                        <MaterialIcons name="volume-off" size={13} color="#fff" />
                        <Text style={styles.tileMetaText}>
                          {loc.metrics?.noiseScore ?? 4.8}/5
                        </Text>
                      </View>
                      <View style={styles.tileMetaItem}>
                        <MaterialIcons name="event-seat" size={13} color="#fff" />
                        <Text style={styles.tileMetaText}>
                          {loc.liveMetrics?.openDesks ?? 18} desks
                        </Text>
                      </View>
                      <View style={styles.tileMetaItem}>
                        <MaterialIcons name="wifi" size={13} color="#fff" />
                        <Text style={styles.tileMetaText}>
                          {loc.liveMetrics?.wifiSpeed ?? '220 Mbps'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 120,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  liveBadge: {
    backgroundColor: colors.greenLight,
    borderColor: colors.greenBorder,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.green,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeBadge: {
    backgroundColor: colors.cream,
    borderColor: colors.creamBorder,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.subtext2,
  },
  hero: {
    marginTop: 16,
    marginBottom: 24,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.maroon,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 4,
    lineHeight: 20,
  },
  suggestSection: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  suggestCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutralBorder,
    borderRadius: 16,
    padding: 16,
  },
  suggestCardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  suggestIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestTextWrap: {
    flex: 1,
  },
  suggestTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },
  suggestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  suggestMetaText: {
    fontSize: 12,
    color: colors.muted,
  },
  inputWrap: {
    marginTop: 20,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ded8cf',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    padding: 0,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tilesSection: {
    gap: 12,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 12,
    color: colors.muted,
  },
  tilesList: {
    gap: 16,
  },
  tile: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileImageWrap: {
    height: 220,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  tileStatusPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tileStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tileStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tileRatingPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tileRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  tileRatingCount: {
    fontSize: 11,
    color: colors.subtext4,
  },
  tileBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  tileName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.3,
  },
  tileSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  tileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  tileMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tileMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
});

