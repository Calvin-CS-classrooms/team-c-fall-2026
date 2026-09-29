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
import { CAMPUS_LOCATIONS, CampusLocation } from '../data/mockData';
import { colors } from '../theme';

interface CampusMapScreenProps {
  onSelectLocation: (loc: CampusLocation) => void;
  onRateLocation: (loc: CampusLocation) => void;
  onProfileClick: () => void;
}

export const CampusMapScreen: React.FC<CampusMapScreenProps> = ({
  onSelectLocation,
  onRateLocation,
  onProfileClick,
}) => {
  const [selectedLoc, setSelectedLoc] = useState<CampusLocation>(CAMPUS_LOCATIONS[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'quiet' | 'open'>('all');

  const filtered = CAMPUS_LOCATIONS.filter((loc) => {
    if (activeFilter === 'quiet') return loc.metrics?.noiseScore && loc.metrics.noiseScore >= 4.5;
    if (activeFilter === 'open') return loc.statusTag !== 'Bustling';
    return true;
  });

  const pins = [
    { loc: CAMPUS_LOCATIONS[0], top: '33%' as const, left: '50%' as const, size: 32 },
    { loc: CAMPUS_LOCATIONS[1], top: '25%' as const, left: '25%' as const, size: 28 },
    { loc: CAMPUS_LOCATIONS[2], top: '66%' as const, left: '75%' as const, size: 28 },
    { loc: CAMPUS_LOCATIONS[3], top: '80%' as const, left: '33%' as const, size: 28 },
  ];

  return (
    <View style={styles.container}>
      <TopHeader type="feed" onProfileClick={onProfileClick} />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {/* Map Header with Filters */}
        <View style={styles.mapHeader}>
          <View style={styles.mapTitleRow}>
            <MaterialIcons name="explore" size={20} color={colors.maroon} />
            <Text style={styles.mapTitle}>Campus Pulse Map</Text>
          </View>
          <View style={styles.liveSyncBadge}>
            <LiveDot size={6} />
            <Text style={styles.liveSyncText}>Live Sync</Text>
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setActiveFilter('all')}
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>
              All Campus (5)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter('quiet')}
            style={[styles.filterChip, activeFilter === 'quiet' && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, activeFilter === 'quiet' && styles.filterChipTextActive]}>
              🤫 Quiet Zones
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter('open')}
            style={[styles.filterChip, activeFilter === 'open' && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, activeFilter === 'open' && styles.filterChipTextActive]}>
              🪑 Open Seats
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Campus Map Canvas */}
        <View style={styles.mapCanvas}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORammRxve1Y5-2OqM8q8NwzjCKyP3Jnl-7-kDCC3gTpMu7DbTmjh5Xsq2iYtLoVghgoH9n36z9kzZoHDocj4jDIhqOpUcpCm_CAaNdb15AoVrajras2DAyAGkcB7VXauGfsq29E2_RIq8lzGdrx3lTwUmbpATOvvp3LtE3gv6-jrA5g96KRjIOTIIi6FwZLw5k4sjMPoSR-Us5R4dVKrbrKI1gu-CbTbG9OO4TELeqb0jFyMQogM7',
            }}
            style={styles.mapImage}
          />
          <View style={styles.mapOverlay} />

          {/* Interactive Spot Markers */}
          {pins.map((pin) => {
            const isSelected = selectedLoc.id === pin.loc.id;
            return (
              <TouchableOpacity
                key={pin.loc.id}
                onPress={() => setSelectedLoc(pin.loc)}
                style={[styles.pin, { top: pin.top, left: pin.left }]}
                accessibilityLabel={`${pin.loc.name} Pin`}
              >
                <View style={[styles.pinLabel, isSelected && styles.pinLabelActive]}>
                  <View
                    style={[
                      styles.pinDot,
                      { backgroundColor: pin.loc.statusDotColor },
                    ]}
                  />
                  <Text style={[styles.pinLabelText, isSelected && styles.pinLabelTextActive]}>
                    {pin.loc.id === 'hekman-library' ? 'Hekman (4.7)' : pin.loc.name.split(' ')[0]}
                  </Text>
                </View>
                <MaterialIcons
                  name="location-on"
                  size={pin.size}
                  color={isSelected ? colors.maroon : 'rgba(107,20,36,0.8)'}
                />
              </TouchableOpacity>
            );
          })}

          {/* Compass pill */}
          <View style={styles.compass}>
            <MaterialIcons name="near-me" size={20} color={colors.maroon} />
          </View>
        </View>

        {/* Selected Location Bottom Card Preview */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.previewLeft}>
              <Image source={{ uri: selectedLoc.image }} style={styles.previewImage} />
              <View>
                <Text style={styles.previewName}>{selectedLoc.name}</Text>
                <Text style={styles.previewSubtitle}>{selectedLoc.subtitle}</Text>
              </View>
            </View>
            <View style={styles.previewRating}>
              <MaterialIcons name="star" size={14} color={colors.star} />
              <Text style={styles.previewRatingText}>{selectedLoc.rating}</Text>
            </View>
          </View>

          <View style={styles.previewMetrics}>
            <View style={styles.previewMetric}>
              <Text style={styles.previewMetricLabel}>Noise Level</Text>
              <Text style={styles.previewMetricValueGreen}>
                {selectedLoc.metrics?.noiseScore ?? 4.8}/5
              </Text>
            </View>
            <View style={styles.previewMetric}>
              <Text style={styles.previewMetricLabel}>Open Seats</Text>
              <Text style={styles.previewMetricValue}>
                {selectedLoc.liveMetrics?.openDesks ?? 18} desks
              </Text>
            </View>
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity onPress={() => onSelectLocation(selectedLoc)} style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View Details</Text>
              <MaterialIcons name="chevron-right" size={16} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRateLocation(selectedLoc)} style={styles.rateBtn}>
              <MaterialIcons name="star" size={16} color={colors.maroon} />
              <Text style={styles.rateBtnText}>Rate Spot</Text>
            </TouchableOpacity>
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
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 8,
  },
  mapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  liveSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  liveSyncText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.green,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.maroon,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtext,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  mapCanvas: {
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 12,
    backgroundColor: '#ded9ce',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  pinLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pinLabelActive: {
    backgroundColor: colors.maroon,
  },
  pinDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pinLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
  },
  pinLabelTextActive: {
    color: colors.white,
  },
  compass: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    padding: 6,
  },
  previewCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  previewImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ebe7e1',
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  previewSubtitle: {
    fontSize: 12,
    color: colors.mutedText,
  },
  previewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.starBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.starLight,
  },
  previewRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350f',
  },
  previewMetrics: {
    flexDirection: 'row',
    gap: 8,
  },
  previewMetric: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewMetricLabel: {
    fontSize: 12,
    color: colors.mutedText,
  },
  previewMetricValueGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
  },
  previewMetricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  viewBtn: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.maroon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  viewBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  rateBtn: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  rateBtnText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});

