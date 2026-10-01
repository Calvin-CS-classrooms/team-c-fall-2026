import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopHeader } from '../components/TopHeader';
import { SurveySpaceCard } from '../components/SurveySpaceCard';
import { SURVEY_SPACES, type CampusSpace } from '../data/surveySpaces';
import { MAP_LAYOUT } from '../data/mapLayout';
import { MAP_FILTERS, filterSurveySpaces, selectedVisibleSpace, type MapFilter } from '../utils/surveyMap';
import { colors } from '../theme';

interface CampusMapScreenProps {
  onSelectLocation: (loc: CampusSpace) => void;
  onProfileClick: () => void;
}
export const CampusMapScreen: React.FC<CampusMapScreenProps> = ({ onSelectLocation, onProfileClick }) => {
  const [selectedId, setSelectedId] = useState(SURVEY_SPACES[0].id);
  const [activeFilter, setActiveFilter] = useState<MapFilter>('all');
  const filtered = filterSurveySpaces(activeFilter);
  // A hidden selection must not leave a preview or details button for an excluded place.
  const selectedLoc = selectedVisibleSpace(filtered, selectedId);

  return (
    <View style={styles.container}>
      <TopHeader type="feed" onProfileClick={onProfileClick} />
      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        <View style={styles.mapHeader}>
          <View style={styles.mapTitleRow}>
            <MaterialIcons name="explore" size={20} color={colors.maroon} />
            <Text style={styles.mapTitle}>Surveyed Places</Text>
          </View>
          <View style={styles.surveyBadge}>
            <Text style={styles.surveyBadgeText}>Prototype Survey</Text>
          </View>
        </View>
        <Text style={{ color: colors.subtext7 }}>Illustrative map positions — not GPS coordinates. Ratings describe student surveys, not current availability.</Text>
        <View style={styles.filterRow}>
          {MAP_FILTERS.map(filter => (
            <TouchableOpacity key={filter.id} onPress={() => setActiveFilter(filter.id)}
              accessibilityRole="button" accessibilityState={{ selected: activeFilter === filter.id }}
              style={[styles.filterChip, activeFilter === filter.id && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, activeFilter === filter.id && styles.filterChipTextActive]}>
                {filter.label}{filter.id === 'all' ? ` (${SURVEY_SPACES.length})` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.mapCanvas}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORammRxve1Y5-2OqM8q8NwzjCKyP3Jnl-7-kDCC3gTpMu7DbTmjh5Xsq2iYtLoVghgoH9n36z9kzZoHDocj4jDIhqOpUcpCm_CAaNdb15AoVrajras2DAyAGkcB7VXauGfsq29E2_RIq8lzGdrx3lTwUmbpATOvvp3LtE3gv6-jrA5g96KRjIOTIIi6FwZLw5k4sjMPoSR-Us5R4dVKrbrKI1gu-CbTbG9OO4TELeqb0jFyMQogM7' }} style={styles.mapImage} accessible={false} />
          <View style={styles.mapOverlay} />
          {filtered.map(space => {
            const position = MAP_LAYOUT[space.id];
            const isSelected = selectedLoc?.id === space.id;
            return position && (
              <TouchableOpacity key={space.id} onPress={() => setSelectedId(space.id)}
                style={[styles.pin, position]} accessibilityRole="button"
                accessibilityState={{ selected: isSelected }} accessibilityLabel={`Select ${space.name}`}>
                <View style={[styles.pinLabel, isSelected && styles.pinLabelActive]}>
                  <Text style={[styles.pinLabelText, isSelected && styles.pinLabelTextActive]}>{space.name}</Text>
                </View>
                <MaterialIcons name="location-on" size={isSelected ? 32 : 28} color={colors.maroon} />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ marginTop: 12 }}>
          {selectedLoc ? <SurveySpaceCard space={selectedLoc} showPhoto
            onViewDetails={() => onSelectLocation(selectedLoc)} />
            : <Text style={{ color: colors.subtext7 }}>No surveyed places match this filter.</Text>}
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
  surveyBadge: {
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
  surveyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.green,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    width: 140,
    alignItems: 'center',
    transform: [{ translateX: -70 }, { translateY: -20 }],
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
  pinLabelText: {
    textAlign: 'center',
    flexShrink: 1,
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
  },
  pinLabelTextActive: {
    color: colors.white,
  },
});

