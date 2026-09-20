import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { getKnightTier } from '@/utils/format';

interface ImpactScoreCardProps {
  ratingsCount: number;
  helpfulVotes: number;
}

export function ImpactScoreCard({ ratingsCount, helpfulVotes }: ImpactScoreCardProps) {
  const tier = getKnightTier(ratingsCount);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badgeWrap}>
          <Ionicons name="shield-checkmark" size={26} color={Colors.gold} />
        </View>
        <View style={styles.tierWrap}>
          <Text style={styles.tierLabel}>{tier.label} Rater</Text>
          {tier.next ? (
            <Text style={styles.tierNext}>
              {Math.round(tier.progress * 100)}% to {tier.next}
            </Text>
          ) : (
            <Text style={styles.tierNext}>Top tier reached</Text>
          )}
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(tier.progress * 100)}%` }]} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{ratingsCount}</Text>
          <Text style={styles.statLabel}>Ratings Submitted</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{helpfulVotes}</Text>
          <Text style={styles.statLabel}>Helpful Votes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.maroon,
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.maroonSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierWrap: {
    flex: 1,
  },
  tierLabel: {
    fontFamily: Typography.extraBold,
    fontSize: 18,
    color: Colors.white,
  },
  tierNext: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.goldSoft,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.maroonSoft,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: Colors.gold,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.maroonSoft,
    marginHorizontal: 12,
  },
  statValue: {
    fontFamily: Typography.extraBold,
    fontSize: 22,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.goldSoft,
    marginTop: 2,
  },
});
