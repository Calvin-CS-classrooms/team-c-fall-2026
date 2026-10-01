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

interface SuggestedRatingsScreenProps {
  location?: CampusLocation;
  reviewSnippet?: string;
  onBack: () => void;
  onConfirmSubmit: () => void;
  onEditManually?: () => void;
  onProfileClick: () => void;
}

export const SuggestedRatingsScreen: React.FC<SuggestedRatingsScreenProps> = ({
  location = CAMPUS_LOCATIONS[0],
  reviewSnippet = 'Example review for the prototype.',
  onBack,
  onConfirmSubmit,
  onEditManually,
  onProfileClick,
}) => {
  const [scores, setScores] = useState({
    noise: 5,
    capacity: 3,
    devices: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const calculateAverage = () => {
    return ((scores.noise + scores.capacity + scores.devices) / 3).toFixed(1);
  };

  const handleScoreChange = (pillar: 'noise' | 'capacity' | 'devices', rating: number) => {
    setScores((prev) => ({
      ...prev,
      [pillar]: rating,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onConfirmSubmit();
      }, 400);
    }, 800);
  };

  const criteria = [
    {
      key: 'noise' as const,
      icon: 'volume-off' as const,
      iconColor: '#047857',
      title: 'Noise Level',
      desc: 'Extremely quiet',
      badge: 'Example only',
      badgeIcon: 'verified' as const,
      badgeColor: '#047857',
      badgeBg: '#ecfdf5',
      badgeBorder: '#a7f3d0',
    },
    {
      key: 'capacity' as const,
      icon: 'group' as const,
      iconColor: colors.goldDark,
      title: 'Capacity & Seating',
      desc: 'Moderate availability',
      badge: 'Example only',
      badgeIcon: 'airline-seat-recline-normal' as const,
      badgeColor: '#92400e',
      badgeBg: '#fffbeb',
      badgeBorder: '#fde68a',
    },
    {
      key: 'devices' as const,
      icon: 'power' as const,
      iconColor: colors.maroon,
      title: 'Device Access & Outlets',
      desc: 'Example outlet rating',
      badge: 'Example only',
      badgeIcon: 'bolt' as const,
      badgeColor: colors.maroon,
      badgeBg: '#fff1f2',
      badgeBorder: '#fecdd3',
    },
  ];

  return (
    <View style={styles.container}>
      <TopHeader
        type="subscreen"
        title="Create Rating"
        onBack={onBack}
        onProfileClick={onProfileClick}
        rightBadgeType="avatar"
      />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {/* Visual Campus Backdrop Header Card */}
        <View style={styles.backdropCard}>
          <View style={styles.backdropImage}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_yMFdAPaj1QTf_KFJ3iKtsbPMQmgufwbROg7ydJ9AQpaR8hX1PD_PtcGfzYVMSZ6rz3brS4wCn_KGI_nfMQ4ZxeoP4rVGZmGLER_nKhMBirWHUo7rpiXQ8bMSkFcQuJocXurXSq3CV-6KN-EV6-g3jRT2W_7W6-as83ifAVXJgp9X5HuGahptHQqpBBW2NHRUr9EDc3VA7gXwWodc0ufp9cEY1Br6GvRtjgq-O_ikkFIIcPyhyGC2',
              }}
              style={styles.backdropImg}
            />
            <View style={styles.backdropOverlay} />
            <View style={styles.aiBadge}>
              <LiveDot color="#059669" size={8} />
              <Text style={styles.aiBadgeText}>Illustrative Preview</Text>
            </View>
          </View>

          <View style={styles.backdropBody}>
            <View style={styles.backdropTitleRow}>
              <View style={styles.backdropTitleLeft}>
                <MaterialIcons name="auto-awesome" size={20} color={colors.maroon} />
                <Text style={styles.backdropTitle}>Sample Breakdown</Text>
              </View>
              <View style={styles.locationPill}>
                <Text style={styles.locationPillText}>{location.name}</Text>
              </View>
            </View>
            <Text style={styles.backdropDesc}>
              Example ratings for {location.name}; not extracted from your review:
            </Text>

            <View style={styles.quoteCard}>
              <MaterialIcons name="format-quote" size={20} color={colors.maroon} />
              <Text style={styles.quoteText} numberOfLines={2}>
                {reviewSnippet}
              </Text>
            </View>
          </View>
        </View>

        {/* Overall Calculated Score Hero Strip */}
        <View style={styles.heroStrip}>
          <View style={styles.heroLeft}>
            <View style={styles.heroScoreLabelRow}>
              <MaterialIcons name="stars" size={18} color={colors.star} />
              <Text style={styles.heroScoreLabel}>Demo Average</Text>
            </View>
            <Text style={styles.heroScore}>
              {calculateAverage()} <Text style={styles.heroScoreSub}>/ 5.0</Text>
            </Text>
            <Text style={styles.heroScoreHint}>Synthesized across 3 core pillars</Text>
          </View>

          <View style={styles.gauge}>
            <View style={styles.gaugeRing}>
              <View style={styles.gaugeInner}>
                <Text style={styles.gaugeValue}>94%</Text>
                <Text style={styles.gaugeLabel}>MATCH</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggested Metrics</Text>
          <Text style={styles.sectionHint}>Tap stars to refine</Text>
        </View>

        {/* Criteria List */}
        <View style={styles.criteriaList}>
          {criteria.map((c) => (
            <View key={c.key} style={styles.criterionCard}>
              <View style={styles.criterionHeader}>
                <View style={styles.criterionTitleWrap}>
                  <View style={styles.criterionTitleRow}>
                    <MaterialIcons name={c.icon} size={18} color={c.iconColor} />
                    <Text style={styles.criterionTitle}>{c.title}</Text>
                  </View>
                  <Text style={styles.criterionDesc}>{c.desc}</Text>
                </View>
                <View
                  style={[
                    styles.criterionBadge,
                    { backgroundColor: c.badgeBg, borderColor: c.badgeBorder },
                  ]}
                >
                  <MaterialIcons name={c.badgeIcon} size={13} color={c.badgeColor} />
                  <Text style={[styles.criterionBadgeText, { color: c.badgeColor }]}>
                    {c.badge}
                  </Text>
                </View>
              </View>

              <View style={styles.starsRow}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleScoreChange(c.key, star)}
                      style={styles.starBtn}
                      accessibilityLabel={`${star} star`}
                    >
                      <MaterialIcons
                        name="star"
                        size={24}
                        color={star <= scores[c.key] ? colors.star : colors.border}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.starScore}>
                  {scores[c.key]} / 5 ★
                </Text>
              </View>
            </View>
          ))}

          <Text style={styles.criterionDesc}>Building hours and current access are not available in the prototype survey.</Text>
        </View>

        {/* Bottom Visual Delight Toast */}
        <View style={styles.toast}>
          <View style={styles.toastIcon}>
            <MaterialIcons name="psychology" size={18} color={colors.maroon} />
          </View>
          <Text style={styles.toastText}>
            Changes are local to this demo. They do not update survey records or any live measurements.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.submitBtn, submitted && styles.submitBtnDone]}
          >
            {isSubmitting ? (
              <>
                <MaterialIcons name="refresh" size={20} color={colors.white} />
                <Text style={styles.submitBtnText}>Finishing Demo...</Text>
              </>
            ) : submitted ? (
              <>
                <MaterialIcons name="check" size={20} color={colors.white} />
                <Text style={styles.submitBtnText}>Demo Complete!</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="check-circle" size={20} color={colors.white} />
                <Text style={styles.submitBtnText}>Finish Demo</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onEditManually} style={styles.editBtn}>
            <MaterialIcons name="tune" size={16} color={colors.dark} />
            <Text style={styles.editBtnText}>Edit All Criteria Manually</Text>
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
    paddingBottom: 140,
  },
  backdropCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  backdropImage: {
    height: 112,
  },
  backdropImg: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  aiBadge: {
    position: 'absolute',
    top: 8,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiBadgeText: {
    fontSize: 11,
    color: '#065f46',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backdropBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    gap: 6,
  },
  backdropTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backdropTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backdropTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  locationPill: {
    backgroundColor: '#F5F3F0',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  locationPillText: {
    fontSize: 11,
    color: colors.subtext,
    fontWeight: '500',
  },
  backdropDesc: {
    fontSize: 13,
    color: colors.subtext,
  },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  quoteText: {
    fontSize: 13,
    color: colors.dark,
    fontStyle: 'italic',
    flex: 1,
  },
  heroStrip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: {
    gap: 2,
  },
  heroScoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroScoreLabel: {
    fontSize: 12,
    color: colors.goldDark,
    fontWeight: '700',
  },
  heroScore: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  heroScoreSub: {
    fontSize: 16,
    color: colors.subtext,
    fontWeight: '400',
  },
  heroScoreHint: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
  },
  gauge: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderColor: colors.star,
    borderLeftColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeInner: {
    alignItems: 'center',
  },
  gaugeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark,
  },
  gaugeLabel: {
    fontSize: 9,
    color: colors.subtext,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.maroon,
    fontWeight: '600',
  },
  criteriaList: {
    gap: 10,
  },
  criterionCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  criterionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  criterionTitleWrap: {
    flex: 1,
    paddingRight: 8,
  },
  criterionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  criterionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  criterionDesc: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: 2,
  },
  criterionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  criterionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  hoursBadgeFlagged: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  hoursBadgeConfirmed: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starBtn: {
    padding: 4,
  },
  starScore: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.star,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  hoursLabel: {
    fontSize: 12,
    color: colors.subtext,
  },
  flagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
  },
  toastIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    fontSize: 11,
    color: colors.subtext,
    lineHeight: 16,
    flex: 1,
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
    gap: 8,
  },
  submitBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.maroon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnDone: {
    backgroundColor: '#047857',
  },
  submitBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  editBtn: {
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },
});

