import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopHeader } from '../components/TopHeader';
import { LiveDot } from '../components/ui';
import { CampusLocation, CAMPUS_LOCATIONS } from '../data/mockData';
import { colors } from '../theme';

interface ConfirmationScreenProps {
  location?: CampusLocation;
  onBackToChat: () => void;
  onRateAnotherSpace: () => void;
  onProfileClick: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  location = CAMPUS_LOCATIONS[0],
  onBackToChat,
  onRateAnotherSpace,
  onProfileClick,
}) => {
  return (
    <View style={styles.container}>
      <TopHeader
        type="subscreen"
        title="Create Rating"
        onBack={onBackToChat}
        onProfileClick={onProfileClick}
        rightBadgeType="avatar"
      />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {/* Ambient celebration glow */}
        <View style={styles.celebration}>
          <View style={styles.glow} />
          <View style={styles.checkBadge}>
            <View style={styles.checkInner}>
              <MaterialIcons name="check" size={44} color={colors.white} />
            </View>
          </View>
        </View>

        {/* Feedback Typography */}
        <View style={styles.feedbackText}>
          <Text style={styles.feedbackTitle}>Review demo complete</Text>
          <Text style={styles.feedbackDesc}>
            Your rating for{' '}
            <Text style={styles.feedbackBold}>{location.name}</Text>{' '}
            was previewed only. Nothing was submitted or added to the survey dataset.
          </Text>
        </View>

        {/* Impact & Rewards Bento Card */}
        <View style={styles.bentoCard}>
          <View style={styles.bentoHeader}>
            <View style={styles.pointsBadge}>
              <MaterialIcons name="stars" size={18} color="#7f5700" />
              <Text style={styles.pointsText}>Example Scout Points</Text>
            </View>
            <View style={styles.liveBadge}>
              <LiveDot color="#005312" size={8} />
              <Text style={styles.liveBadgeText}>Demo</Text>
            </View>
          </View>

          <View style={styles.tilesRow}>
            <View style={styles.tile}>
              <View style={styles.tileHeaderGreen}>
                <MaterialIcons name="verified" size={18} color="#005312" />
                <Text style={styles.tileHeaderGreenText}>Status</Text>
              </View>
              <Text style={styles.tileValue}>Example Contributor</Text>
              <Text style={styles.tileSub}>Calvin Student</Text>
            </View>

            <View style={styles.tile}>
              <View style={styles.tileHeaderGold}>
                <MaterialIcons name="local-library" size={18} color="#7f5700" />
                <Text style={styles.tileHeaderGoldText}>
                  {location.name.split(' ')[0]}
                </Text>
              </View>
              <Text style={styles.tileBigValue}>149</Text>
              <Text style={styles.tileSub}>Example Review Count</Text>
            </View>
          </View>

          <View style={styles.impactTile}>
            <View style={styles.impactIcon}>
              <MaterialIcons name="insights" size={20} color={colors.maroon} />
            </View>
            <View style={styles.impactTextWrap}>
              <Text style={styles.impactTitle}>Community Impact</Text>
              <Text style={styles.impactDesc} numberOfLines={1}>
                This demo does not update survey ratings or live measurements.
              </Text>
            </View>
          </View>
        </View>

        {/* Primary & Secondary Navigation Controls */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onBackToChat} style={styles.primaryBtn}>
            <MaterialIcons name="chat-bubble" size={20} color={colors.white} />
            <Text style={styles.primaryBtnText}>Back to Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onRateAnotherSpace} style={styles.secondaryBtn}>
            <MaterialIcons name="add-location-alt" size={20} color={colors.black} />
            <Text style={styles.secondaryBtnText}>Rate Another Space</Text>
          </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 60,
    alignItems: 'center',
  },
  celebration: {
    width: 176,
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  glow: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: 'rgba(107,20,36,0.1)',
  },
  checkBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  feedbackTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
    letterSpacing: -0.5,
  },
  feedbackDesc: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  feedbackBold: {
    fontWeight: '700',
    color: colors.black,
  },
  bentoCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 24,
  },
  bentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,222,174,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(253,186,69,0.3)',
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7f5700',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eaf7ea',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(136,217,130,0.3)',
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#005312',
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 12,
  },
  tileHeaderGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tileHeaderGreenText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#005312',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tileHeaderGold: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tileHeaderGoldText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7f5700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tileValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
    marginTop: 8,
  },
  tileBigValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.black,
    marginTop: 6,
  },
  tileSub: {
    fontSize: 11,
    color: colors.mutedText,
    marginTop: 2,
  },
  impactTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 12,
  },
  impactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107,20,36,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactTextWrap: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.black,
  },
  impactDesc: {
    fontSize: 12,
    color: colors.mutedText,
  },
  actions: {
    width: '100%',
    gap: 10,
    marginTop: 32,
  },
  primaryBtn: {
    height: 48,
    backgroundColor: colors.maroon,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 48,
    backgroundColor: '#EDE8E3',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '700',
  },
});

