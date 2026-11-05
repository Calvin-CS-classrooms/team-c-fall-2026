import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { AppHeader } from '@/components/app-header';
import { Chip } from '@/components/chip';
import { TextField } from '@/components/text-field';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import type { SpaceSuggestion } from '@/types';
import { amenityTally, hasSuggestedToday, netScore, PROMOTION_THRESHOLD } from '@/utils/suggestions';

// Preset amenity options shown as selectable chips when suggesting a space.
const AMENITY_OPTIONS = ['Wi-Fi', 'Outlets', 'Seating', 'Quiet', 'Group Friendly', 'Natural Light', 'Food Nearby'];

/**
 * Suggestions screen: lets users propose new study spaces for the community.
 * Contains a suggestion form (name, description, usage, amenities), a list of
 * pending suggestions that others can vote on, and a section for suggestions
 * that have been promoted to official spaces.
 */
export function SuggestionsScreen() {
  const router = useRouter();
  const { calvinEmail, suggestions, submitSuggestion } = useAppData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [usage, setUsage] = useState('');
  // Selected amenity chips for the new suggestion.
  const [amenities, setAmenities] = useState<string[]>([]);
  // Text for adding a custom amenity not in the preset list.
  const [customAmenity, setCustomAmenity] = useState('');
  // Validation/submission error message to display, if any.
  const [error, setError] = useState('');
  // Whether the current suggestion was successfully submitted.
  const [submitted, setSubmitted] = useState(false);

  // Suggestions awaiting votes vs. those already promoted to official.
  const pending = suggestions.filter((suggestion) => suggestion.status === 'pending');
  const official = suggestions.filter((suggestion) => suggestion.status === 'official');
  // Whether the user has already used their one suggestion per day.
  const limitReached = calvinEmail ? hasSuggestedToday(suggestions, calvinEmail) : false;

  // Adds or removes an amenity from the selected set.
  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]));
  };

  // Adds the typed custom amenity if it is non-empty and not already selected.
  const addCustomAmenity = () => {
    const value = customAmenity.trim();
    if (value && !amenities.includes(value)) setAmenities((prev) => [...prev, value]);
    setCustomAmenity('');
  };

  // Submits the suggestion; on success clears the form and shows a thank-you.
  const handleSubmit = () => {
    const result = submitSuggestion({ name, description, usage, amenities });
    setError(result ?? '');
    if (!result) {
      setName('');
      setDescription('');
      setUsage('');
      setAmenities([]);
      setSubmitted(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader title="Suggest a Space" subtitle="Help the community find more study spots" />

        <View style={styles.section}>
          <Pressable style={styles.backRow} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="chevron-back" size={18} color={Colors.maroon} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Suggestion</Text>
          <View style={styles.card}>
            {!calvinEmail ? (
              <Text style={styles.helperText}>Log in with your Calvin email to suggest a space.</Text>
            ) : limitReached ? (
              <Text style={styles.helperText}>
                {submitted ? 'Thanks! Your suggestion is now open for votes. ' : ''}
                You can suggest one space per day. Come back tomorrow to suggest another.
              </Text>
            ) : (
              <>
                <TextField label="Space name" placeholder="e.g. Science Building Atrium" value={name} onChangeText={setName} />
                <TextField
                  label="Description"
                  placeholder="What is the space like?"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
                <TextField
                  label="What is it normally used for?"
                  placeholder="e.g. Lectures during the day, empty in the evening"
                  value={usage}
                  onChangeText={setUsage}
                  multiline
                />
                <Text style={styles.label}>Amenities</Text>
                <View style={styles.chipRow}>
                  {[...AMENITY_OPTIONS, ...amenities.filter((item) => !AMENITY_OPTIONS.includes(item))].map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      selected={amenities.includes(amenity)}
                      onPress={() => toggleAmenity(amenity)}
                    />
                  ))}
                </View>
                <View style={styles.inlineRow}>
                  <TextInput
                    placeholder="Add another amenity"
                    placeholderTextColor={Colors.textMuted}
                    value={customAmenity}
                    onChangeText={setCustomAmenity}
                    onSubmitEditing={addCustomAmenity}
                    style={styles.inlineInput}
                  />
                  <ActionButton label="Add" variant="outline" onPress={addCustomAmenity} />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <ActionButton label="Submit Suggestion" icon="send-outline" onPress={handleSubmit} />
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Suggestions</Text>
          <Text style={styles.helperText}>
            Spaces with {PROMOTION_THRESHOLD} or more net helpful votes become official spaces.
          </Text>
          {pending.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
          {pending.length === 0 ? <Text style={styles.helperText}>No suggestions waiting for votes.</Text> : null}
        </View>

        {official.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Now Official</Text>
            {official.map((suggestion) => (
              <View key={suggestion.id} style={styles.officialRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                <Text style={styles.officialText}>{suggestion.name} is now listed under Study &amp; Quiet.</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Renders a single community suggestion with its vote progress, helpful/not
 * helpful voting, and per-amenity keep/remove voting. Users cannot vote on
 * their own suggestion.
 */
function SuggestionCard({ suggestion }: { suggestion: SpaceSuggestion }) {
  const { calvinEmail, voteOnSuggestion, voteOnAmenity, proposeAmenity } = useAppData();
  const [newAmenity, setNewAmenity] = useState('');
  const score = netScore(suggestion);
  const myVote = calvinEmail ? suggestion.votes[calvinEmail] : undefined;
  const isOwn = Boolean(calvinEmail) && suggestion.submittedBy === calvinEmail;
  const canVote = Boolean(calvinEmail) && !isOwn;

  // Proposes the typed amenity for this suggestion and clears the input.
  const submitAmenity = () => {
    proposeAmenity(suggestion.id, newAmenity);
    setNewAmenity('');
  };

  return (
    <View style={styles.card}>
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionName}>{suggestion.name}</Text>
        <Text style={styles.scoreText}>
          {score} / {PROMOTION_THRESHOLD}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(Math.max(score, 0) / PROMOTION_THRESHOLD, 1) * 100}%` }]} />
      </View>
      {suggestion.description ? <Text style={styles.bodyText}>{suggestion.description}</Text> : null}
      {suggestion.usage ? <Text style={styles.metaText}>Usually used for: {suggestion.usage}</Text> : null}

      <Text style={styles.label}>Is this a helpful space?</Text>
      {isOwn ? (
        <Text style={styles.metaText}>You suggested this space.</Text>
      ) : (
        <View style={styles.chipRow}>
          <Chip
            label="Helpful"
            icon="thumbs-up-outline"
            selected={myVote === 1}
            disabled={!canVote}
            onPress={() => voteOnSuggestion(suggestion.id, 1)}
          />
          <Chip
            label="Not helpful"
            icon="thumbs-down-outline"
            selected={myVote === -1}
            disabled={!canVote}
            onPress={() => voteOnSuggestion(suggestion.id, -1)}
          />
        </View>
      )}

      <Text style={styles.label}>Amenities</Text>
      {suggestion.amenities.map((amenity) => {
        const tally = amenityTally(amenity);
        const mine = calvinEmail ? amenity.votes[calvinEmail] : undefined;
        return (
          <View key={amenity.name} style={styles.amenityRow}>
            <Text style={styles.amenityName}>{amenity.name}</Text>
            <Pressable
              disabled={!calvinEmail}
              onPress={() => voteOnAmenity(suggestion.id, amenity.name, 'keep')}
              style={[styles.amenityVote, mine === 'keep' && styles.amenityVoteActive]}
              accessibilityLabel={`Keep ${amenity.name}`}>
              <Ionicons name="add" size={14} color={mine === 'keep' ? Colors.white : Colors.success} />
              <Text style={[styles.amenityCount, mine === 'keep' && styles.amenityCountActive]}>{tally.keep}</Text>
            </Pressable>
            <Pressable
              disabled={!calvinEmail}
              onPress={() => voteOnAmenity(suggestion.id, amenity.name, 'remove')}
              style={[styles.amenityVote, mine === 'remove' && styles.amenityVoteActive]}
              accessibilityLabel={`Remove ${amenity.name}`}>
              <Ionicons name="remove" size={14} color={mine === 'remove' ? Colors.white : Colors.danger} />
              <Text style={[styles.amenityCount, mine === 'remove' && styles.amenityCountActive]}>{tally.remove}</Text>
            </Pressable>
          </View>
        );
      })}
      {calvinEmail ? (
        <View style={styles.inlineRow}>
          <TextInput
            placeholder="Suggest an amenity to add"
            placeholderTextColor={Colors.textMuted}
            value={newAmenity}
            onChangeText={setNewAmenity}
            onSubmitEditing={submitAmenity}
            style={styles.inlineInput}
          />
          <ActionButton label="Add" variant="outline" onPress={submitAmenity} />
        </View>
      ) : (
        <Text style={styles.metaText}>Log in with your Calvin email to vote.</Text>
      )}
    </View>
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.maroon,
  },
  sectionTitle: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
  },
  label: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  helperText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  errorText: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.danger,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  suggestionName: {
    flex: 1,
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  scoreText: {
    fontFamily: Typography.bold,
    fontSize: 13,
    color: Colors.maroon,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceAlt,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
  },
  bodyText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metaText: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityName: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  amenityVote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.surfaceAlt,
  },
  amenityVoteActive: {
    backgroundColor: Colors.maroon,
  },
  amenityCount: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  amenityCountActive: {
    color: Colors.white,
  },
  officialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  officialText: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textPrimary,
  },
});
