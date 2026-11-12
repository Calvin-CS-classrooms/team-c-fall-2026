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
import type { SpotSuggestion } from '@/types';
import { hasSuggestedToday, PROMOTION_THRESHOLD } from '@/utils/suggestions';

/**
 * Suggestions screen: lets users propose new study spaces for the community.
 * Contains a suggestion form (name, description), a list of suggestions that
 * others can vote on, and a section for suggestions that have been approved.
 */
export function SuggestionsScreen() {
  const router = useRouter();
  const { account, suggestions, submitSuggestion } = useAppData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // Validation/submission error message to display, if any.
  const [error, setError] = useState('');
  // Whether the current suggestion was successfully submitted.
  const [submitted, setSubmitted] = useState(false);

  // Suggestions awaiting votes vs. those already approved.
  const pending = suggestions.filter((suggestion) => suggestion.status === 'beingTested');
  const approved = suggestions.filter((suggestion) => suggestion.status === 'approved');
  // Whether the user has already used their one suggestion per day.
  const limitReached = account ? hasSuggestedToday(suggestions, account.id) : false;

  // Submits the suggestion; on success clears the form and shows a thank-you.
  const handleSubmit = () => {
    const result = submitSuggestion({ name, description, usage: '', amenities: [] });
    setError(result ?? '');
    if (!result) {
      setName('');
      setDescription('');
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
            {!account ? (
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

        {approved.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Now Official</Text>
            {approved.map((suggestion) => (
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
 * Renders a single community suggestion with its vote count and helpful/not
 * helpful voting. Users cannot vote on their own suggestion.
 */
function SuggestionCard({ suggestion }: { suggestion: SpotSuggestion }) {
  const { account, voteOnSuggestion, suggestionVotes } = useAppData();
  const myVote = account ? suggestionVotes.find((v) => v.suggestionId === suggestion.id && v.userId === account.id)?.vote : undefined;
  const isOwn = Boolean(account) && suggestion.userId === account?.id;
  const canVote = Boolean(account) && !isOwn;

  return (
    <View style={styles.card}>
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionName}>{suggestion.name}</Text>
        <Text style={styles.scoreText}>{suggestion.numUpvotes} votes</Text>
      </View>
      {suggestion.description ? <Text style={styles.bodyText}>{suggestion.description}</Text> : null}

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
      {!account ? <Text style={styles.metaText}>Log in with your Calvin email to vote.</Text> : null}
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
