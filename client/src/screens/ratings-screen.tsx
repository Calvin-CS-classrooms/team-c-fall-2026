import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { ImpactScoreCard } from '@/components/impact-score-card';
import { RatingForm } from '@/components/rating-form';
import { RatingHistoryRow } from '@/components/rating-history-row';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { getSpaceById } from '@/data/spaces';
import { isOwnRating } from '@/utils/ratings';
import { spaceIdFromParam } from '@/utils/route-params';

/**
 * Ratings screen: shows the user's rating "status" (number of ratings and
 * helpful votes), lets the user submit a new rating, and lists their
 * rating history with mark-helpful and delete actions.
 *
 * Opening it as /ratings?spaceId=3 (e.g. from "Rate this space" on a building
 * page) preselects that space in the form.
 */
export function RatingsScreen() {
  const { ratings, addRating, markHelpful, deleteRating, account, settings } = useAppData();
  const requestedSpaceId = spaceIdFromParam(useLocalSearchParams<{ spaceId?: string }>().spaceId);
  const myRatings = ratings.filter((rating) => isOwnRating(rating, account?.id));
  // Total helpful votes across all of the user's ratings.
  const helpfulVotes = myRatings.reduce((sum, rating) => sum + rating.numUpvotes, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader title="Your Ratings" subtitle="Share what's happening on campus" />

        <View style={styles.section}>
          <ImpactScoreCard ratingsCount={myRatings.length} helpfulVotes={helpfulVotes} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submit a Rating</Text>
          <View style={styles.formCard}>
            {/* Rating submission requires a verified Calvin email; otherwise
                prompt the user to add one in the profile section. */}
            {account ? (
              <>
                {settings.anonymousMode ? (
                  <Text style={styles.noticeText}>Anonymous Mode is on: this rating will show as Anonymous user.</Text>
                ) : null}
                {/* Keyed by the requested space so a new "Rate this space" tap
                    resets the form to that space, even if this tab was already open. */}
                <RatingForm key={requestedSpaceId ?? 'none'} initialSpaceId={requestedSpaceId} onSubmit={addRating} />
              </>
            ) : (
              <Text style={styles.noticeText}>
                Log in with your Calvin email to submit a rating.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rating History</Text>
          <View style={styles.historyList}>
            {myRatings.map((rating) => {
              const space = getSpaceById(rating.spaceId);
              return (
                <RatingHistoryRow
                  key={rating.id}
                  rating={rating}
                  name={space?.name ?? `Space ${rating.spaceId}`}
                  onMarkHelpful={() => markHelpful(rating.id)}
                  onDelete={() => deleteRating(rating.id)}
                />
              );
            })}
            {myRatings.length === 0 ? <Text style={styles.emptyText}>No ratings yet. Submit your first one above!</Text> : null}
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
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  noticeText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  historyList: {
    gap: 12,
  },
  emptyText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
