import React, { useState } from 'react';
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
import { LiveDot } from '../components/ui';
import { CampusLocation, CAMPUS_LOCATIONS } from '../data/mockData';
import { colors } from '../theme';

interface PlaceDetailsScreenProps {
  location?: CampusLocation;
  onBack: () => void;
  onChat: () => void;
  onRateThisPlace: (location: CampusLocation) => void;
  onProfileClick: () => void;
}

export const PlaceDetailsScreen: React.FC<PlaceDetailsScreenProps> = ({
  location = CAMPUS_LOCATIONS[0],
  onBack,
  onChat,
  onRateThisPlace,
  onProfileClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const images =
    location.detailImages && location.detailImages.length > 0
      ? location.detailImages
      : [location.image];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const metricBars = [
    {
      label: 'Noise Level',
      icon: 'volume-off' as const,
      color: colors.green,
      score: location.metrics?.noiseScore ?? 4.8,
      sub: location.metrics?.noiseSub ?? 'Whisper quiet / Silent study policy strictly honored',
    },
    {
      label: 'Capacity & Seating',
      icon: 'chair' as const,
      color: colors.gold,
      score: location.metrics?.capacityScore ?? 4.5,
      sub: location.metrics?.capacitySub ?? 'Seats ~85, typically 20+ desks open at night',
    },
    {
      label: 'Device Access & Outlets',
      icon: 'power' as const,
      color: colors.maroon,
      score: location.metrics?.deviceScore ?? 4.7,
      sub: location.metrics?.deviceSub ?? 'Wall & table power at every desk, strong eduroam',
    },
    {
      label: 'Atmosphere & Lighting',
      icon: 'lightbulb' as const,
      color: colors.goldDark,
      score: location.metrics?.atmosphereScore ?? 4.6,
      sub: location.metrics?.atmosphereSub ?? 'Warm reading lamps, large exterior tree-view windows',
    },
  ];

  return (
    <View style={styles.container}>
      <TopHeader
        type="subscreen"
        title="Location Details"
        onBack={onBack}
        onProfileClick={onProfileClick}
        rightBadgeType="initial"
      />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {/* Photo Carousel */}
        <View style={styles.carousel}>
          <Image source={{ uri: images[currentImageIndex] }} style={styles.carouselImage} />
          <View style={styles.carouselOverlay} />

          <View style={styles.carouselTopLeft}>
            <Text style={styles.carouselTag}>2nd Floor Quiet Study</Text>
          </View>

          <View style={styles.carouselTopRight}>
            <TouchableOpacity
              onPress={() => setIsBookmarked(!isBookmarked)}
              style={styles.carouselBtn}
              accessibilityLabel="Bookmark"
            >
              <MaterialIcons
                name="bookmark"
                size={20}
                color={isBookmarked ? colors.maroon : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.carouselBtn} accessibilityLabel="Share">
              <MaterialIcons name="ios-share" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.carouselIndicators}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.indicator,
                  idx === currentImageIndex ? styles.indicatorActive : styles.indicatorInactive,
                ]}
              />
            ))}
          </View>

          {images.length > 1 && (
            <View style={styles.carouselControls}>
              <TouchableOpacity onPress={handlePrevImage} style={styles.carouselControlBtn} accessibilityLabel="Previous Photo">
                <MaterialIcons name="chevron-left" size={16} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextImage} style={styles.carouselControlBtn} accessibilityLabel="Next Photo">
                <MaterialIcons name="chevron-right" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Title and Status Header */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{location.name}</Text>
            <View style={styles.liveStatus}>
              <LiveDot />
              <Text style={styles.liveStatusText}>Live Status</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={18} color={colors.maroon} />
            <Text style={styles.locationText}>
              {location.locationDetails || location.subtitle}
            </Text>
          </View>

          <View style={styles.hoursPill}>
            <MaterialIcons name="schedule" size={16} color={colors.amber} />
            <Text style={styles.hoursText}>
              {location.hoursToday || 'Open today • 7:00 AM – 11:00 PM'}
            </Text>
          </View>
        </View>

        {/* Student Feedback Breakdown Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Student Feedback Breakdown</Text>
            <Text style={styles.cardUpdated}>Updated 2h ago</Text>
          </View>

          {metricBars.map((m) => (
            <View key={m.label} style={styles.metricBlock}>
              <View style={styles.metricRow}>
                <View style={styles.metricLabelRow}>
                  <MaterialIcons name={m.icon} size={18} color={m.color} />
                  <Text style={styles.metricLabel}>{m.label}</Text>
                </View>
                <Text style={styles.metricScore}>
                  {m.score} <Text style={styles.metricScoreSub}>/ 5</Text>
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(m.score / 5) * 100}%`, backgroundColor: m.color },
                  ]}
                />
              </View>
              <Text style={styles.metricSub}>{m.sub}</Text>
            </View>
          ))}
        </View>

        {/* Verified Student Take Card */}
        <View style={styles.card}>
          <View style={styles.quoteHeader}>
            <MaterialIcons name="format-quote" size={18} color={colors.maroon} />
            <Text style={styles.quoteTitle}>Verified Student Take</Text>
          </View>
          <Text style={styles.quoteText}>
            “{location.studentTake?.quote ??
              'Best spot on campus during finals week. Never have to hunt for a plug, and the gentle HVAC hum makes it easy to lock in.'}”
          </Text>
          <View style={styles.quoteFooter}>
            <View style={styles.quoteAuthorRow}>
              <View style={styles.quoteAvatar}>
                <Text style={styles.quoteAvatarText}>
                  {location.studentTake?.author ? location.studentTake.author[0] : 'J'}
                </Text>
              </View>
              <Text style={styles.quoteAuthor}>
                {location.studentTake?.author ?? 'Junior'},{' '}
                {location.studentTake?.major ?? 'Computer Science Major'}
              </Text>
            </View>
            <Text style={styles.quoteTime}>{location.studentTake?.timeAgo ?? '3 days ago'}</Text>
          </View>
        </View>

        {/* Environment micro-tiles */}
        <View style={styles.envGrid}>
          <View style={styles.envTile}>
            <View style={[styles.envIcon, styles.envIconGreen]}>
              <MaterialIcons name="thermostat" size={20} color={colors.green} />
            </View>
            <View>
              <Text style={styles.envLabel}>Temperature</Text>
              <Text style={styles.envValue}>
                {location.liveMetrics?.temperature ?? '69°F • Ideal'}
              </Text>
            </View>
          </View>
          <View style={styles.envTile}>
            <View style={[styles.envIcon, styles.envIconGold]}>
              <MaterialIcons name="wifi" size={20} color={colors.gold} />
            </View>
            <View>
              <Text style={styles.envLabel}>Eduroam</Text>
              <Text style={styles.envValue}>
                {location.liveMetrics?.wifiSpeed ?? '220 Mbps'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <TouchableOpacity onPress={onChat} style={styles.chatBtn}>
            <MaterialIcons name="chat-bubble-outline" size={18} color={colors.text} />
            <Text style={styles.chatBtnText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRateThisPlace(location)} style={styles.rateBtn}>
            <MaterialIcons name="star" size={18} color={colors.white} />
            <Text style={styles.rateBtnText}>Rate This Place</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  carousel: {
    height: 224,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#171717',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  carouselTopLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  carouselTag: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    overflow: 'hidden',
  },
  carouselTopRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  carouselBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  indicatorActive: {
    width: 16,
    backgroundColor: colors.white,
  },
  indicatorInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  carouselControls: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
  },
  carouselControlBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginTop: 16,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    flex: 1,
  },
  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  liveStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: colors.subtext,
    flex: 1,
  },
  hoursPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.amberLight,
    borderWidth: 1,
    borderColor: colors.amberBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  hoursText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amber,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f2eee9',
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardUpdated: {
    fontSize: 12,
    color: colors.muted,
  },
  metricBlock: {
    gap: 4,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  metricScore: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  metricScoreSub: {
    color: colors.lightText,
    fontWeight: '400',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricSub: {
    fontSize: 12,
    color: colors.muted,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  quoteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.maroon,
  },
  quoteText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  quoteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f2eee9',
  },
  quoteAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quoteAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteAvatarText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  quoteAuthor: {
    fontSize: 13,
    color: colors.subtext,
  },
  quoteTime: {
    fontSize: 12,
    color: colors.lightText,
  },
  envGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  envTile: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  envIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envIconGreen: {
    backgroundColor: colors.greenLight,
  },
  envIconGold: {
    backgroundColor: colors.amberLight,
  },
  envLabel: {
    fontSize: 11,
    color: colors.muted,
  },
  envValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatBtn: {
    flex: 1,
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#d8d3ca',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chatBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  rateBtn: {
    flex: 2,
    height: 48,
    backgroundColor: colors.maroon,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rateBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});

