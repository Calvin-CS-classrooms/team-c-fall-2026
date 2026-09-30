import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TopHeader } from '../components/TopHeader';
import { LiveDot } from '../components/ui';
import { CampusLocation, CAMPUS_LOCATIONS } from '../data/mockData';
import { colors } from '../theme';

interface WriteReviewScreenProps {
  location?: CampusLocation;
  onBack: () => void;
  onAnalyzeReview: (reviewText: string) => void;
  onSkipToManual: () => void;
  onProfileClick: () => void;
}

export const WriteReviewScreen: React.FC<WriteReviewScreenProps> = ({
  location = CAMPUS_LOCATIONS[0],
  onBack,
  onAnalyzeReview,
  onSkipToManual,
  onProfileClick,
}) => {
  const [reviewText, setReviewText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const tags = [
    'Outlets galore',
    'Whisper quiet',
    'Crowded',
    'Good for studying',
    'Room to sit',
  ];

  const handleTagClick = (tag: string) => {
    if (!reviewText.includes(tag)) {
      const space = reviewText.trim().length > 0 && !reviewText.endsWith(' ') ? ' ' : '';
      setReviewText((prev) => `${prev}${space}${tag}. `);
    }
  };

  const handleClear = () => {
    setReviewText('');
  };

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedSuccess(true);
      setTimeout(() => {
        onAnalyzeReview(reviewText);
      }, 500);
    }, 900);
  };

  const extracted = [
    { icon: 'volume-off' as const, color: '#00410c', label: 'Noise', value: 'Sample quiet rating' },
    { icon: 'power' as const, color: '#7f5700', label: 'Outlets', value: 'Sample outlet rating' },
    { icon: 'chair' as const, color: colors.maroon, label: 'Seats', value: 'Sample seating rating' },
    { icon: 'school' as const, color: '#00410c', label: 'Studying', value: 'Sample study rating' },
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
        {/* Location Header Banner */}
        <View style={styles.locationBanner}>
          <View style={styles.locationBannerBody}>
            <View style={styles.liveVibeRow}>
              <View style={styles.liveVibeBadge}>
                <LiveDot color="#002905" size={6} />
                <Text style={styles.liveVibeText}>Review Demo</Text>
              </View>
              <Text style={styles.updatedText}>Sample data</Text>
            </View>
            <Text style={styles.locationTitle} numberOfLines={1}>
              Rate {location.name}
            </Text>
            <Text style={styles.locationDesc} numberOfLines={2}>
              Fictional preview only. Reviews are not saved or added to survey recommendations.
            </Text>
          </View>
          <Image
            source={{
              uri:
                location.id === 'hekman-library'
                  ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo0icVZz-Ji17fQDgVinnCq_9zomTd6ndrJnPSMu5nU6QMUc-U4eg9fvAyJowPQ076rZrTkrkUBzr-kn8tg60BQ3TR998j3K9D6JQ0yQM_DaKTDywF4VmoYEqX6G-m2MbvRxyyEgQkpIj0N81gooqOG2oWTJ1Mt8r9fDt407JWXQk_0Xkq4PSglKCLcTXQKnli1g3xWelpUlSwBT8TTo2NDvZz13cO39j9hIph2KGq-6fsFrNWzbCN'
                  : location.image,
            }}
            style={styles.locationImage}
          />
        </View>

        {/* Review Input Box */}
        <View style={styles.card}>
          <View style={styles.inputHeader}>
            <View style={styles.inputLabelRow}>
              <MaterialIcons name="edit-note" size={20} color={colors.maroon} />
              <Text style={styles.inputLabel}>Your Observation</Text>
            </View>
            <Text style={styles.charCount}>{reviewText.length} / 500 characters</Text>
          </View>

          <View style={styles.textAreaWrap}>
            <TextInput
              value={reviewText}
              onChangeText={setReviewText}
              maxLength={500}
              multiline
              numberOfLines={5}
              placeholder="Describe your experience with studying, noise, outlets, or seating."
              placeholderTextColor={colors.subtext3}
              style={styles.textArea}
            />
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <MaterialIcons name="backspace" size={14} color={colors.subtext2} />
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Quick keyword suggestion tags */}
          <View style={styles.tagsSection}>
            <Text style={styles.tagsLabel}>Quick Add Highlights</Text>
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <TouchableOpacity key={tag} onPress={() => handleTagClick(tag)} style={styles.tag}>
                  <Text style={styles.tagPlus}>+</Text>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Illustrative rating preview */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiAvatar}>
              <MaterialIcons name="auto-awesome" size={20} color={colors.white} />
            </View>
            <View style={styles.aiHeaderText}>
              <View style={styles.aiTitleRow}>
                <Text style={styles.aiTitle}>Sample Rating Preview</Text>
                <View style={styles.aiDot} />
              </View>
              <Text style={styles.aiDesc}>
                These fixed example ratings demonstrate the review flow. They are not extracted from your notes.
              </Text>
            </View>
          </View>

          <View style={styles.extractedGrid}>
            {extracted.map((e) => (
              <View key={e.label} style={styles.extractedTile}>
                <MaterialIcons name={e.icon} size={18} color={e.color} />
                <View style={styles.extractedTextWrap}>
                  <Text style={styles.extractedLabel}>{e.label}</Text>
                  <Text style={styles.extractedValue} numberOfLines={1}>
                    {e.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Primary & Secondary Action Block */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleAnalyzeClick}
            disabled={isAnalyzing}
            style={styles.analyzeBtn}
          >
            {isAnalyzing ? (
              <>
                <MaterialIcons name="refresh" size={20} color={colors.white} />
                <Text style={styles.analyzeBtnText}>Loading Preview...</Text>
              </>
            ) : analyzedSuccess ? (
              <>
                <MaterialIcons name="check-circle" size={20} color={colors.white} />
                <Text style={styles.analyzeBtnText}>Preview Ready!</Text>
              </>
            ) : (
              <>
                <Text style={styles.analyzeBtnText}>Preview Sample Ratings</Text>
                <MaterialIcons name="auto-awesome" size={20} color={colors.white} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkipToManual} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip to manual rating</Text>
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
    gap: 16,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  locationBannerBody: {
    flex: 1,
  },
  liveVibeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  liveVibeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#a3f69c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  liveVibeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#002204',
  },
  updatedText: {
    fontSize: 11,
    color: colors.subtext2,
  },
  locationTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  locationDesc: {
    fontSize: 13,
    color: colors.subtext2,
    marginTop: 2,
  },
  locationImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f5f3f0',
    borderWidth: 1,
    borderColor: colors.border,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  charCount: {
    fontSize: 12,
    color: colors.subtext2,
    fontWeight: '600',
  },
  textAreaWrap: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  textArea: {
    minHeight: 120,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    paddingTop: 4,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.subtext2,
  },
  tagsSection: {
    gap: 8,
    paddingTop: 4,
  },
  tagsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.subtext2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#efeeeb',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagPlus: {
    color: colors.maroon,
    fontWeight: '700',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  aiCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHeaderText: {
    flex: 1,
    gap: 4,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#002905',
  },
  aiDesc: {
    fontSize: 13,
    color: colors.subtext2,
    lineHeight: 18,
  },
  extractedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  extractedTile: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  extractedTextWrap: {
    flex: 1,
  },
  extractedLabel: {
    fontSize: 11,
    color: colors.subtext2,
  },
  extractedValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  actions: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  analyzeBtn: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.maroon,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  skipBtn: {
    paddingVertical: 4,
  },
  skipBtnText: {
    fontSize: 12,
    color: colors.subtext2,
    textDecorationLine: 'underline',
  },
});

