import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CapacitySlider } from '@/components/capacity-slider';
import { Chip } from '@/components/chip';
import { StarRating } from '@/components/star-rating';
import { Colors, NoiseLabels } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';
import { getLocationById } from '@/data/locations';
import type { NewRatingInput, NoiseLevel } from '@/types';

const NOISE_LEVELS: NoiseLevel[] = ['whisper', 'lowBuzz', 'social', 'loud'];

interface RatingFormProps {
  initialSpaceId?: number;
  onSubmit: (input: NewRatingInput) => void;
  submitLabel?: string;
}

/**
 * The rating form, shown on the ratings screen (only after the user has
 * been verified). Lets the user pick a space, a 5-star overall rating,
 * a crowd rating slider, noise level chips, an optional tip textbox, and
 * a submit button.
 *
 * @param initialSpaceId - Space preselected when the form opens.
 * @param onSubmit - Called with the completed rating when submitted.
 * @param submitLabel - Text for the submit button.
 */
export function RatingForm({ initialSpaceId, onSubmit, submitLabel = 'Submit Rating' }: RatingFormProps) {
  const { spaces } = useAppData();
  const [spaceId, setSpaceId] = useState(initialSpaceId ?? spaces[0].id);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [capacity, setCapacity] = useState(50);
  const [noise, setNoise] = useState<NoiseLevel>('lowBuzz');
  const [stars, setStars] = useState(4);
  const [comment, setComment] = useState('');

  // Resolve the selected space object; falls back to the first space if the
  // stored id no longer matches (e.g. data changed).
  const selectedSpace = spaces.find((space) => space.id === spaceId) ?? spaces[0];
  const selectedLocation = getLocationById(selectedSpace.locationId);

  // Builds the rating payload and submits it, then resets the form fields
  // (comment) so it's ready for the next entry.
  const handleSubmit = () => {
    onSubmit({
      spaceId: selectedSpace.id,
      numStars: stars,
      crowdRating: capacity,
      perceivedNoise: noise,
      description: comment.trim() || undefined,
    });
    setComment('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Space</Text>
      <Pressable style={styles.picker} onPress={() => setPickerOpen((open) => !open)}>
        <View style={styles.pickerLeft}>
          <Ionicons name="location-outline" size={16} color={Colors.maroon} />
          <Text style={styles.pickerText}>{selectedLocation?.name ?? `Space ${selectedSpace.id}`}</Text>
        </View>
        <Ionicons name={pickerOpen ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
      </Pressable>
      {pickerOpen ? (
        <View style={styles.pickerList}>
          {spaces.map((space) => {
            const loc = getLocationById(space.locationId);
            return (
              <Pressable
                key={space.id}
                style={styles.pickerOption}
                onPress={() => {
                  setSpaceId(space.id);
                  setPickerOpen(false);
                }}>
                <Text style={[styles.pickerOptionText, space.id === spaceId && styles.pickerOptionTextActive]}>
                  {loc?.name ?? `Space ${space.id}`}
                </Text>
                {space.id === spaceId ? <Ionicons name="checkmark" size={16} color={Colors.maroon} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <Text style={styles.label}>Overall Rating</Text>
      <StarRating value={stars} onChange={setStars} size={28} />

      <Text style={styles.label}>Crowd Rating</Text>
      <CapacitySlider value={capacity} onChange={setCapacity} />

      <Text style={styles.label}>Noise Level</Text>
      <View style={styles.chipRow}>
        {NOISE_LEVELS.map((level) => (
          <Chip key={level} label={NoiseLabels[level]} selected={noise === level} onPress={() => setNoise(level)} />
        ))}
      </View>

      <Text style={styles.label}>Add a tip (optional)</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="e.g. Group rooms are booked until 9 PM"
        placeholderTextColor={Colors.textMuted}
        style={styles.textInput}
        multiline
      />

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}

// Scrollable wrapper around RatingForm, for use in contexts where the form
// needs to scroll independently (e.g. inside a modal or sheet).
export function RatingFormScroll(props: RatingFormProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <RatingForm {...props} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 14,
    marginBottom: 6,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceAlt,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerText: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  pickerList: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionText: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pickerOptionTextActive: {
    color: Colors.maroon,
    fontFamily: Typography.semiBold,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 70,
    textAlignVertical: 'top',
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
  },
  submitButton: {
    marginTop: 18,
    backgroundColor: Colors.maroon,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.white,
  },
});
