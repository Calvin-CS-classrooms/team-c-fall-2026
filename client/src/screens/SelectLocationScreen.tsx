import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopHeader } from '../components/TopHeader';
import { LiveDot } from '../components/ui';
import { CampusLocation, CAMPUS_LOCATIONS } from '../data/mockData';
import { colors } from '../theme';

interface SelectLocationScreenProps {
  onBack: () => void;
  onSelectLocation: (loc: CampusLocation) => void;
  onProfileClick: () => void;
}

export const SelectLocationScreen: React.FC<SelectLocationScreenProps> = ({
  onBack,
  onSelectLocation,
  onProfileClick,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Spots');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<CampusLocation | null>(null);

  const categories = [
    'All Spots',
    'Libraries',
    'Lounges',
    'Dining/Cafes',
    'Labs',
    'Outdoors',
  ];

  const filteredLocations = CAMPUS_LOCATIONS.filter((loc) => {
    const matchesCategory =
      activeCategory === 'All Spots' || loc.category === activeCategory;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.vibeTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (loc: CampusLocation) => {
    setSelectedSpot(loc);
  };

  const handleProceed = () => {
    if (selectedSpot) {
      onSelectLocation(selectedSpot);
    }
  };

  const handleAddNewPlace = () => {
    Alert.prompt(
      'Suggest a new spot',
      'Suggest a new Calvin campus spot to add to directory:',
      (name) => {
        if (name && name.trim()) {
          Alert.alert(
            'Thank you!',
            `"${name.trim()}" has been submitted for student moderation.`
          );
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <TopHeader
        type="subscreen"
        title="Create Rating"
        onBack={onBack}
        onProfileClick={onProfileClick}
        rightBadgeType="initial"
      />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {/* Interactive Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerTextWrap}>
            <View style={styles.headerEyebrowRow}>
              <MaterialIcons name="pin-drop" size={16} color={colors.maroon} />
              <Text style={styles.headerEyebrow}>Campus Directory</Text>
            </View>
            <Text style={styles.headerTitle}>Select a Location</Text>
            <Text style={styles.headerSubtitle}>
              Choose the campus space you'd like to rate or review.
            </Text>
          </View>
          <TouchableOpacity onPress={onBack} style={styles.dismissBtn} accessibilityLabel="Dismiss screen">
            <MaterialIcons name="close" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={colors.subtext3} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search places, events, and dining..."
            placeholderTextColor={colors.lightText}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn} accessibilityLabel="Clear search">
              <MaterialIcons name="close" size={14} color={colors.mutedText} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Micro-stat Bar */}
        <View style={styles.statBar}>
          <Text style={styles.statText}>{filteredLocations.length} Verified Campus Spots</Text>
          <View style={styles.syncRow}>
            <LiveDot color={colors.emerald} size={8} />
            <Text style={styles.syncText}>Live Noise & Crowd Sync</Text>
          </View>
        </View>

        {/* Location Cards List */}
        <View style={styles.list}>
          {filteredLocations.map((loc) => {
            const isChosen = selectedSpot?.id === loc.id;
            return (
              <TouchableOpacity
                key={loc.id}
                onPress={() => onSelectLocation(loc)}
                onLongPress={() => handleCardClick(loc)}
                style={[styles.card, isChosen && styles.cardChosen]}
              >
                <View style={styles.cardImageWrap}>
                  <Image source={{ uri: loc.image }} style={styles.cardImage} />
                  <View style={styles.cardImageOverlay} />
                  <View style={styles.cardStatusPill}>
                    <View style={[styles.cardStatusDot, { backgroundColor: loc.statusDotColor }]} />
                    <Text style={[styles.cardStatusText, { color: loc.statusColor }]}>
                      {loc.statusTag}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {loc.name}
                    </Text>
                    <MaterialIcons name="chevron-right" size={18} color={colors.subtext3} />
                  </View>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {loc.subtitle}
                  </Text>

                  <View style={styles.cardTags}>
                    <View style={styles.ratingBadge}>
                      <MaterialIcons name="star" size={13} color={colors.star} />
                      <Text style={styles.ratingText}>{loc.rating}</Text>
                    </View>
                    <View style={styles.vibeTag}>
                      <Text style={styles.vibeTagText}>{loc.vibeTag}</Text>
                    </View>
                    <View style={styles.metricTag}>
                      <MaterialIcons name={loc.metricIcon as any} size={11} color={colors.emerald} />
                      <Text style={styles.metricTagText}>{loc.metricTag}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredLocations.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialIcons name="travel-explore" size={28} color={colors.subtext3} />
              </View>
              <Text style={styles.emptyTitle}>No campus spots found</Text>
              <Text style={styles.emptyText}>
                Double check your spelling or propose this undiscovered location to the Calvin community.
              </Text>
            </View>
          )}
        </View>

        {/* Add New Place Action */}
        <View style={styles.addSection}>
          <TouchableOpacity onPress={handleAddNewPlace} style={styles.addBtn}>
            <MaterialIcons name="add-location-alt" size={20} color={colors.maroon} />
            <Text style={styles.addBtnText}>Can't find your spot? Add a new place +</Text>
          </TouchableOpacity>
          <View style={styles.verifiedRow}>
            <MaterialIcons name="verified-user" size={14} color={colors.lightText} />
            <Text style={styles.verifiedText}>Submissions are student-moderated</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Selection Bar */}
      {selectedSpot && (
        <View style={styles.floatingBar}>
          <View style={styles.floatingLeft}>
            <View style={styles.floatingIcon}>
              <MaterialIcons name="edit-note" size={20} color={colors.white} />
            </View>
            <View style={styles.floatingTextWrap}>
              <Text style={styles.floatingTitle} numberOfLines={1}>
                {selectedSpot.name}
              </Text>
              <Text style={styles.floatingSubtitle}>Ready for your rating & review</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleProceed} style={styles.continueBtn}>
            <Text style={styles.continueText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: 16,
    paddingBottom: 140,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    paddingBottom: 4,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.maroon,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 2,
  },
  dismissBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#e6e1da',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ded8cf',
    borderRadius: 999,
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    padding: 0,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f2eee9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ded8cf',
  },
  chipActive: {
    backgroundColor: colors.maroon,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.subtext5,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  statBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  statText: {
    fontSize: 11,
    color: colors.mutedText,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.emerald,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#e8e3dc',
  },
  cardChosen: {
    borderColor: colors.maroon,
    borderWidth: 2,
  },
  cardImageWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ebe7e1',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardStatusPill: {
    position: 'absolute',
    bottom: 4,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  cardStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 2,
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.starBg,
    borderWidth: 1,
    borderColor: colors.starLight,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350f',
  },
  vibeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.softBorder,
  },
  vibeTagText: {
    fontSize: 11,
    color: colors.subtext,
  },
  metricTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: colors.emeraldBorder,
  },
  metricTagText: {
    fontSize: 11,
    color: colors.emerald,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#e6e1da',
    borderRadius: 16,
    marginTop: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  emptyText: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 4,
    textAlign: 'center',
  },
  addSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  addBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(107,20,36,0.4)',
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.maroon,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 11,
    color: colors.lightText,
  },
  floatingBar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderWidth: 1,
    borderColor: '#e6e1da',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  floatingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  floatingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTextWrap: {
    flex: 1,
  },
  floatingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
  },
  floatingSubtitle: {
    fontSize: 12,
    color: colors.emerald,
    fontWeight: '500',
  },
  continueBtn: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: colors.maroon,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  continueText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

