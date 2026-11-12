import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { getLocationById } from '@/data/locations';
import { askSpotAgent, type SpotAgentResponse } from '@/services/spot-agent';
import { applyDiscoveryFilters, DISCOVERY_FILTERS, type DiscoveryFilter } from '@/utils/discovery';

/**
 * Home screen: the main landing view. Contains the combinable space filter
 * chips, the "Ask Calvin" search bar backed by the mock spot-finder agent, a
 * scrollable carousel of popular spaces, and a live activity feed.
 */
export function HomeScreen() {
  const { addRating, account, spaces, ratings } = useAppData();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<DiscoveryFilter[]>([]);
  const [quickRateVisible, setQuickRateVisible] = useState(false);
  const [agentResponse, setAgentResponse] = useState<SpotAgentResponse | null>(null);
  const [agentThinking, setAgentThinking] = useState(false);
  const latestQuery = useRef(0);

  // Recompute the visible spaces whenever the active filters change.
  // A space must meet every active filter to be shown.
  const filteredSpaces = useMemo(
    () => applyDiscoveryFilters(spaces, ratings, activeFilters),
    [activeFilters, spaces, ratings],
  );

  const toggleFilter = (filter: DiscoveryFilter) => {
    setActiveFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter],
    );
  };

  // Handles search submission: sends the trimmed query to the mock agent and
  // clears the input while the answer loads.
  const askCalvin = async () => {
    const nextQuestion = search.trim();
    if (!nextQuestion) return;
    setSearch('');
    setAgentThinking(true);
    const queryId = ++latestQuery.current;
    const response = await askSpotAgent(nextQuestion, spaces);
    // Ignore answers to older questions if the user asked again in the meantime.
    if (queryId !== latestQuery.current) return;
    setAgentResponse(response);
    setAgentThinking(false);
  };

  const firstName = account?.name.split(' ')[0];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader
          title={firstName ? `Hi, ${firstName} 👋` : 'Hi there 👋'}
          subtitle="Calvin University"
          leftAccessory={account ? <VerifiedBadge label="@calvin.edu Verified" /> : null}
        />

        <View style={styles.section}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onSubmit={askCalvin}
            placeholder='Ask: "quiet spot with outlets near the library"'
          />
          {agentThinking ? (
            <View style={styles.recommendationCard}>
              <View style={styles.thinkingRow}>
                <ActivityIndicator color={Colors.goldSoft} size="small" />
                <Text style={styles.recommendationQuestion}>Finding the best spot for you…</Text>
              </View>
            </View>
          ) : agentResponse ? (
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationEyebrow}>
                <View style={styles.eyebrowRow}>
                  <Text style={styles.recommendationLabel}>Spot Finder · mock AI</Text>
                  <Pressable onPress={() => setAgentResponse(null)} hitSlop={8} accessibilityLabel="Dismiss recommendation">
                    <Ionicons name="close" size={16} color={Colors.goldSoft} />
                  </Pressable>
                </View>
                <Text style={styles.recommendationQuestion}>&ldquo;{agentResponse.query}&rdquo;</Text>
                <Text style={styles.recommendationReason}>{agentResponse.message}</Text>
              </View>
              {agentResponse.recommendations.map((recommendation) => {
                const loc = getLocationById(recommendation.space.locationId);
                return (
                  <View key={recommendation.space.id} style={styles.recommendationBody}>
                    <Text style={styles.recommendationTitle}>{loc?.name ?? `Space ${recommendation.space.id}`}</Text>
                    {recommendation.reasons.map((reason) => (
                      <Text key={reason} style={styles.recommendationReason}>
                        ✓ {reason}
                      </Text>
                    ))}
                    {recommendation.missing.length > 0 ? (
                      <Text style={styles.recommendationNote}>Missing: {recommendation.missing.join(', ')}</Text>
                    ) : null}
                  </View>
                );
              })}
              <Text style={styles.recommendationNote}>Based on campus ratings, not live conditions.</Text>
            </View>
          ) : null}
          <View style={styles.filterRow}>
            {DISCOVERY_FILTERS.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                selected={activeFilters.includes(filter.key)}
                onPress={() => toggleFilter(filter.key)}
              />
            ))}
            {activeFilters.length > 0 ? (
              <Chip label="Clear" icon="close" onPress={() => setActiveFilters([])} />
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <GpsBanner locationLabel="Hekman Library Floor 2" onPress={() => setQuickRateVisible(true)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular On-Campus Today</Text>
          <FlatList
            data={filteredSpaces}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.carousel}
            renderItem={({ item }) => {
              const location = getLocationById(item.locationId);
              return (
                <LocationCard
                  space={item}
                  name={location?.name ?? `Space ${item.id}`}
                  image={location?.image}
                />
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No spots match all of your filters. Tap Clear to reset.</Text>
            }
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
        spaceId={1}
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
    flexWrap: 'wrap',
    gap: 8,
  },
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  eyebrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    paddingVertical: 12,
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
    gap: 3,
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
