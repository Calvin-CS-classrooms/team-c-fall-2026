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
import { colors } from '../theme';

interface RecommendationScreenProps {
  userQuery?: string;
  onViewDetails: () => void;
  onAskFollowUp?: (text: string) => void;
  onProfileClick: () => void;
  onMenuClick?: () => void;
  onPreviewMap?: () => void;
}

export const RecommendationScreen: React.FC<RecommendationScreenProps> = ({
  userQuery = 'Where is the best place to study on campus at 7 PM?',
  onViewDetails,
  onAskFollowUp,
  onProfileClick,
  onMenuClick,
  onPreviewMap,
}) => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [activeFollowUp, setActiveFollowUp] = useState<string | null>(null);

  const handleChipClick = (question: string) => {
    setActiveFollowUp(question);
    if (onAskFollowUp) {
      onAskFollowUp(question);
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader type="feed" onMenu={onMenuClick} onProfileClick={onProfileClick} />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {/* Interactive Context Status Indicator */}
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

        {/* Chat Transcript Stream */}
        <View style={styles.chatStream}>
          {/* User Bubble */}
          <View style={styles.userBubbleWrap}>
            <View style={styles.userBubble}>
              <Text style={styles.userBubbleText}>{userQuery}</Text>
            </View>
            <Text style={styles.userTime}>7:00 PM</Text>
          </View>

          {/* Assistant Response Group */}
          <View style={styles.assistantGroup}>
            <View style={styles.assistantAvatar}>
              <MaterialIcons name="school" size={18} color={colors.white} />
            </View>
            <View style={styles.assistantBody}>
              <View style={styles.assistantNameRow}>
                <Text style={styles.assistantName}>Calvin Scout AI</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              </View>
              <View style={styles.assistantBubble}>
                <Text style={styles.assistantText}>
                  Hekman Library is a strong option tonight. The 2nd floor quiet room has 18 open desks with dedicated AC outlets and high-speed Wi-Fi.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rich Recommendation Card */}
        <View style={styles.recCard}>
          {/* Photo Header with Live Badge */}
          <View style={styles.photoHeader}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdf2aoel0obnIfOiWnGYWzWN6pcg6D9qVVOgdBobUYlNU0jPbq-rUYBuDm_NP2rP3b3DyNlfWhyew2oXJ5TaRFuW60mOfCG6kapnvUO_RIErDL8CiI7qIz4ZqQxyRZYIQFJjIj4Uzr1HHpIgeX_YU8WevM8IuKrpRIagDhJ_MDrI-Esi4d6fCalko6UUynhQVHZgGYT9KQVXqoRihf-ydEGdCnYLz1eHNPcTSQjz4vleb2WwnZPXG4',
              }}
              style={styles.photo}
            />
            <View style={styles.photoOverlay} />
            <View style={styles.optimalBadge}>
              <LiveDot />
              <Text style={styles.optimalText}>Optimal Conditions</Text>
            </View>
            <View style={styles.photoBottom}>
              <View>
                <Text style={styles.topRecLabel}>Top Recommendation</Text>
                <Text style={styles.photoTitle}>Hekman Library</Text>
                <Text style={styles.photoSubtitle}>2nd Floor Quiet Zone</Text>
              </View>
              <View style={styles.ratingPill}>
                <MaterialIcons name="star" size={16} color={colors.gold} />
                <Text style={styles.ratingText}>4.7</Text>
                <Text style={styles.ratingCount}>(142)</Text>
              </View>
            </View>
          </View>

          {/* Criteria Breakdown Grid */}
          <View style={styles.criteriaGrid}>
            <View style={styles.criteriaCard}>
              <View style={styles.criteriaHeader}>
                <Text style={styles.criteriaLabel}>Noise Level</Text>
                <Text style={styles.criteriaScoreGreen}>4.9/5</Text>
              </View>
              <View style={styles.criteriaRow}>
                <MaterialIcons name="volume-off" size={18} color={colors.green} />
                <Text style={styles.criteriaTitle}>Quiet Zone</Text>
              </View>
              <Text style={styles.criteriaSub}>Pin-drop silence</Text>
            </View>

            <View style={styles.criteriaCard}>
              <View style={styles.criteriaHeader}>
                <Text style={styles.criteriaLabel}>Capacity</Text>
                <Text style={styles.capacityBadge}>65% Empty</Text>
              </View>
              <View style={styles.criteriaRow}>
                <MaterialIcons name="event-seat" size={18} color={colors.green} />
                <Text style={styles.criteriaTitle}>Seats Open</Text>
              </View>
              <Text style={styles.criteriaSub}>18 desks detected</Text>
            </View>

            <View style={styles.criteriaCard}>
              <View style={styles.criteriaHeader}>
                <Text style={styles.criteriaLabel}>Device Access</Text>
                <Text style={styles.criteriaScoreGold}>4.8/5</Text>
              </View>
              <View style={styles.criteriaRow}>
                <MaterialIcons name="power" size={18} color={colors.gold} />
                <Text style={styles.criteriaTitle}>Dedicated AC</Text>
              </View>
              <Text style={styles.criteriaSub}>Gigabit Wi-Fi</Text>
            </View>

            <View style={styles.criteriaCard}>
              <View style={styles.criteriaHeader}>
                <Text style={styles.criteriaLabel}>Hours</Text>
                <Text style={styles.hoursBadge}>4h left</Text>
              </View>
              <View style={styles.criteriaRow}>
                <MaterialIcons name="schedule" size={18} color={colors.gold} />
                <Text style={styles.criteriaTitle}>Until 11 PM</Text>
              </View>
              <Text style={styles.criteriaSub}>Late quiet hours</Text>
            </View>
          </View>

          {/* Rating Summary Micro-bar */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryLeft}>
              <View style={styles.summaryIcon}>
                <MaterialIcons name="thumb-up" size={16} color={colors.maroon} />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Calvin Score Metric</Text>
                <Text style={styles.summaryTitle}>Overall Rating</Text>
              </View>
            </View>
            <View style={styles.summaryRating}>
              <MaterialIcons name="star" size={18} color={colors.gold} />
              <Text style={styles.summaryRatingText}>4.7</Text>
              <Text style={styles.summaryRatingSub}>/ 5.0</Text>
            </View>
          </View>

          {/* Location Snapshot with Map Data */}
          <TouchableOpacity onPress={onPreviewMap} style={styles.mapSnapshot}>
            <View style={styles.mapSnapshotInner}>
              <View style={styles.mapLocationRow}>
                <MaterialIcons name="location-on" size={18} color={colors.maroon} />
                <Text style={styles.mapLocationText}>East Campus Core • 3 min walk</Text>
              </View>
              <Text style={styles.mapPreviewText}>Preview Map</Text>
            </View>
          </TouchableOpacity>

          {/* Primary & Secondary Actions */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onViewDetails} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>View Details & Live Desk Map</Text>
              <MaterialIcons name="chevron-right" size={18} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleChipClick('How crowded is Peet’s coffee right now?')}
              style={styles.secondaryBtn}
            >
              <MaterialIcons name="chat" size={18} color={colors.maroon} />
              <Text style={styles.secondaryBtnText}>Ask Follow-Up Question</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Follow-Up Chips */}
        <View style={styles.chipsSection}>
          <View style={styles.chipsHeader}>
            <Text style={styles.chipsLabel}>Suggested Questions</Text>
            <Text style={styles.chipsHint}>Tap to send</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            <TouchableOpacity onPress={() => handleChipClick('Any open study rooms?')} style={styles.chip}>
              <MaterialIcons name="meeting-room" size={16} color={colors.gold} />
              <Text style={styles.chipText}>Any open study rooms?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChipClick("Is Peet's Coffee open?")} style={styles.chip}>
              <MaterialIcons name="local-cafe" size={16} color={colors.gold} />
              <Text style={styles.chipText}>Is Peet's Coffee open?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChipClick('Quieter alternative?')} style={styles.chip}>
              <MaterialIcons name="volume-mute" size={16} color={colors.green} />
              <Text style={styles.chipText}>Quieter alternative?</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Follow-up reply */}
        {activeFollowUp && (
          <View style={styles.followUp}>
            <MaterialIcons name="info" size={18} color={colors.maroon} />
            <Text style={styles.followUpText}>
              <Text style={styles.followUpBold}>{activeFollowUp}</Text>
              {': Peet\'s Coffee is open until 9:00 PM tonight on Commons 1st floor. Hekman 3rd floor study rooms 302 and 305 are currently unoccupied.'}
            </Text>
          </View>
        )}

        {/* Inline Context Feedback */}
        <View style={styles.feedbackRow}>
          <Text style={styles.feedbackText}>Was this recommendation helpful?</Text>
          <View style={styles.feedbackBtns}>
            <TouchableOpacity
              onPress={() => setFeedback('yes')}
              style={[
                styles.feedbackBtn,
                feedback === 'yes' && styles.feedbackBtnYes,
              ]}
            >
              <MaterialIcons
                name="thumb-up"
                size={16}
                color={feedback === 'yes' ? colors.green : colors.muted}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFeedback('no')}
              style={[
                styles.feedbackBtn,
                feedback === 'no' && styles.feedbackBtnNo,
              ]}
            >
              <MaterialIcons
                name="thumb-down"
                size={16}
                color={feedback === 'no' ? colors.red : colors.muted}
              />
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
  chatStream: {
    gap: 16,
    paddingTop: 4,
  },
  userBubbleWrap: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#efebe4',
    borderWidth: 1,
    borderColor: '#e2ddd5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderTopRightRadius: 4,
  },
  userBubbleText: {
    fontSize: 14,
    color: colors.subtext8,
    lineHeight: 20,
  },
  userTime: {
    fontSize: 11,
    color: colors.subtext3,
    marginTop: 4,
    marginRight: 4,
  },
  assistantGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  assistantBody: {
    flex: 1,
    gap: 8,
  },
  assistantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assistantName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  verifiedBadge: {
    backgroundColor: colors.maroonLight,
    borderWidth: 1,
    borderColor: '#f5b8c0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.maroon,
  },
  assistantBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  assistantText: {
    fontSize: 14,
    color: colors.subtext7,
    lineHeight: 20,
  },
  recCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#e6e1d8',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    marginTop: 4,
  },
  photoHeader: {
    height: 144,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  optimalBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  optimalText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.green,
  },
  photoBottom: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  topRecLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fde4ad',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  photoSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  ratingCount: {
    fontSize: 11,
    color: colors.subtext4,
  },
  criteriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  criteriaCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 10,
  },
  criteriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  criteriaLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '500',
  },
  criteriaScoreGreen: {
    fontSize: 11,
    color: colors.green,
    fontWeight: '700',
  },
  criteriaScoreGold: {
    fontSize: 11,
    color: colors.goldDark,
    fontWeight: '700',
  },
  capacityBadge: {
    fontSize: 11,
    color: colors.green,
    fontWeight: '700',
    backgroundColor: '#e8f5ec',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hoursBadge: {
    fontSize: 11,
    color: colors.goldDark,
    fontWeight: '700',
    backgroundColor: colors.amberLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  criteriaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  criteriaSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  summaryBar: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.muted,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  summaryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  summaryRatingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  summaryRatingSub: {
    fontSize: 12,
    color: colors.muted,
  },
  mapSnapshot: {
    height: 96,
    borderRadius: 12,
    backgroundColor: '#e8e4dc',
    justifyContent: 'flex-end',
    padding: 10,
  },
  mapSnapshotInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapLocationText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  mapPreviewText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.maroon,
    textDecorationLine: 'underline',
  },
  actions: {
    gap: 8,
    paddingTop: 4,
  },
  primaryBtn: {
    height: 48,
    backgroundColor: colors.maroon,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtn: {
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#d8d3ca',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  chipsSection: {
    gap: 6,
    paddingTop: 4,
  },
  chipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  chipsLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chipsHint: {
    fontSize: 11,
    color: colors.muted,
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#dfdad1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext6,
  },
  followUp: {
    backgroundColor: '#fcfbf9',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  followUpText: {
    fontSize: 13,
    color: colors.subtext7,
    flex: 1,
  },
  followUpBold: {
    fontWeight: '700',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 8,
  },
  feedbackText: {
    fontSize: 12,
    color: colors.muted,
  },
  feedbackBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedbackBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.creamBorder,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBtnYes: {
    backgroundColor: colors.greenLight,
    borderColor: colors.green,
  },
  feedbackBtnNo: {
    backgroundColor: colors.redLight,
    borderColor: colors.red,
  },
});

