import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityFeedRow } from '@/components/activity-feed-row';
import { AppHeader } from '@/components/app-header';
import { Chip } from '@/components/chip';
import { GpsBanner } from '@/components/gps-banner';
import { LocationCard } from '@/components/location-card';
import { QuickRateSheet } from '@/components/quick-rate-sheet';
import { SearchBar } from '@/components/search-bar';
import { VerifiedBadge } from '@/components/verified-badge';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { activityFeed } from '@/data/activity';
import { getLocationById, locations } from '@/data/locations';

const FILTERS = ['Now Open', 'Quiet Spots', 'Trending'] as const;
type FilterOption = (typeof FILTERS)[number];

export function HomeScreen() {
  const { addRating } = useAppData();
  const [search, setSearch] = useState('');
  const [question, setQuestion] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);
  const [quickRateVisible, setQuickRateVisible] = useState(false);

  const filteredLocations = useMemo(() => {
    let result = locations;
    if (activeFilter === 'Now Open') {
      result = result.filter((location) => location.isOpenNow);
    } else if (activeFilter === 'Quiet Spots') {
      result = result.filter((location) => location.density === 'quiet');
    } else if (activeFilter === 'Trending') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [activeFilter]);

  const askCalvin = () => {
    const nextQuestion = search.trim();
    if (!nextQuestion) return;
    setQuestion(nextQuestion);
    setSearch('');
  };

  const questionLower = question.toLowerCase();
  const recommendation = question
    ? questionLower.includes('study') || questionLower.includes('exam') || questionLower.includes('quiet') || questionLower.includes('focus')
      ? { location: getLocationById('hekman-library'), floor: 'Floor 4 — Silent Floor', reason: 'Best match for focused exam studying' }
      : questionLower.includes('coffee') || questionLower.includes('cafe')
        ? { location: getLocationById('peets-coffee'), floor: 'Main Floor', reason: 'Best match for coffee and study seating' }
        : questionLower.includes('gym') || questionLower.includes('workout')
          ? { location: getLocationById('morren-fitness'), floor: 'Main Gym', reason: 'Best match for workouts' }
          : { location: getLocationById('hekman-library'), floor: 'Floor 2 — Reading Room', reason: 'Best overall campus study match' }
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader
          title="Hi, John 👋"
          subtitle="Calvin University"
          leftAccessory={<VerifiedBadge label="@calvin.edu Verified" />}
        />

        <View style={styles.section}>
          <SearchBar value={search} onChangeText={setSearch} onSubmit={askCalvin} />
          {recommendation?.location ? (
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationEyebrow}>
                <Text style={styles.recommendationLabel}>Calvin Ratings recommendation</Text>
                <Text style={styles.recommendationQuestion}>{question}</Text>
              </View>
              <Pressable style={styles.recommendationBody}>
                <View style={styles.recommendationCopy}>
                  <Text style={styles.recommendationTitle}>{recommendation.location.name} · {recommendation.floor}</Text>
                  <Text style={styles.recommendationReason}>{recommendation.reason}</Text>
                  <Text style={styles.recommendationNote}>Based on campus ratings, not live conditions.</Text>
                </View>
              </Pressable>
            </View>
          ) : null}
          <View style={styles.filterRow}>
            {FILTERS.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                selected={activeFilter === filter}
                onPress={() => setActiveFilter((current) => (current === filter ? null : filter))}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <GpsBanner locationLabel="Hekman Library Floor 2" onPress={() => setQuickRateVisible(true)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular On-Campus Today</Text>
          <FlatList
            data={filteredLocations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.carousel}
            renderItem={({ item }) => <LocationCard location={item} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Activity Feed</Text>
          <View style={styles.feedCard}>
            {activityFeed.map((item) => (
              <ActivityFeedRow key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>

      <QuickRateSheet
        visible={quickRateVisible}
        onClose={() => setQuickRateVisible(false)}
        locationId="hekman-library"
        onSubmit={addRating}
      />
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  recommendationCard: {
    backgroundColor: Colors.maroon,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  recommendationEyebrow: {
    gap: 4,
  },
  recommendationLabel: {
    fontFamily: Typography.semiBold,
    fontSize: 11,
    color: Colors.goldSoft,
    textTransform: 'uppercase',
  },
  recommendationQuestion: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.white,
  },
  recommendationBody: {
    borderTopWidth: 1,
    borderTopColor: Colors.maroonSoft,
    paddingTop: 10,
  },
  recommendationCopy: {
    gap: 4,
  },
  recommendationTitle: {
    fontFamily: Typography.bold,
    fontSize: 17,
    color: Colors.white,
  },
  recommendationReason: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.white,
  },
  recommendationNote: {
    fontFamily: Typography.medium,
    fontSize: 11,
    color: Colors.goldSoft,
  },
  sectionTitle: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  carousel: {
    gap: 12,
    paddingRight: 8,
  },
  feedCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
});
