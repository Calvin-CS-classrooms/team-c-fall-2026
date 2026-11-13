import { useState, type ComponentProps } from 'react';
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
 * been verified). Lets the user pick a building and then a floor or area
 * inside it, a 5-star overall rating,
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
  // Which picker list is open, if any. Only one is open at a time.
  const [openPicker, setOpenPicker] = useState<'building' | 'space' | null>(null);
  const [capacity, setCapacity] = useState(50);
  const [noise, setNoise] = useState<NoiseLevel>('lowBuzz');
  const [stars, setStars] = useState(4);
  const [comment, setComment] = useState('');

  // Resolve the selected space object; falls back to the first space if the
  // stored id no longer matches (e.g. data changed).
  const selectedSpace = spaces.find((space) => space.id === spaceId) ?? spaces[0];
  const selectedLocation = getLocationById(selectedSpace.locationId);

  // Each building once, in the order its first space appears. The building is
  // derived from the selected space, so the two pickers can never disagree.
  const buildingIds = [...new Set(spaces.map((space) => space.locationId))];
  const buildingSpaces = spaces.filter((space) => space.locationId === selectedSpace.locationId);

  const togglePicker = (picker: 'building' | 'space') =>
    setOpenPicker((current) => (current === picker ? null : picker));

  // Choosing a different building selects its first floor/area so the form
  // stays valid; the user can then refine it in the second picker. Picking
  // the building that is already selected keeps the current floor.
  const chooseBuilding = (locationId: number) => {
    if (locationId !== selectedSpace.locationId) {
      const firstSpace = spaces.find((space) => space.locationId === locationId);
      if (firstSpace) setSpaceId(firstSpace.id);
    }
    setOpenPicker(null);
  };

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
      <Text style={styles.label}>Building</Text>
      <PickerField
        icon="business-outline"
        accessibilityLabel={`Building: ${selectedLocation?.name ?? `Location ${selectedSpace.locationId}`}`}
        value={selectedLocation?.name ?? `Location ${selectedSpace.locationId}`}
        open={openPicker === 'building'}
        onToggle={() => togglePicker('building')}
        options={buildingIds.map((locationId) => {
          const name = getLocationById(locationId)?.name ?? `Location ${locationId}`;
          return {
            key: locationId,
            label: name,
            accessibilityLabel: `Choose building ${name}`,
            selected: locationId === selectedSpace.locationId,
          };
        })}
        onSelect={chooseBuilding}
      />

      <Text style={styles.label}>Floor or area</Text>
      <PickerField
        icon="layers-outline"
        accessibilityLabel={`Floor or area: ${selectedSpace.name}`}
        value={selectedSpace.name}
        open={openPicker === 'space'}
        onToggle={() => togglePicker('space')}
        options={buildingSpaces.map((space) => ({
          key: space.id,
          label: space.name,
          accessibilityLabel: `Choose space ${space.name}`,
          selected: space.id === selectedSpace.id,
        }))}
        onSelect={(id) => {
          setSpaceId(id);
          setOpenPicker(null);
        }}
      />

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

      <Pressable
        style={styles.submitButton}
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel="Submit rating">
        <Text style={styles.submitText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}

interface PickerOption {
  key: number;
  label: string;
  accessibilityLabel: string;
  selected: boolean;
}

interface PickerFieldProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  accessibilityLabel: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  options: PickerOption[];
  onSelect: (key: number) => void;
}

// A tappable field showing the current choice; tapping it expands a list of
// options below it, with a checkmark on the selected one.
function PickerField({ icon, accessibilityLabel, value, open, onToggle, options, onSelect }: PickerFieldProps) {
  return (
    <>
      <Pressable
        style={styles.picker}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}>
        <View style={styles.pickerLeft}>
          <Ionicons name={icon} size={16} color={Colors.maroon} />
          <Text style={styles.pickerText}>{value}</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
      </Pressable>
      {open ? (
        <View style={styles.pickerList}>
          {options.map((option) => (
            <Pressable
              key={option.key}
              style={styles.pickerOption}
              onPress={() => onSelect(option.key)}
              accessibilityRole="button"
              accessibilityLabel={option.accessibilityLabel}
              accessibilityState={{ selected: option.selected }}>
              <Text style={[styles.pickerOptionText, option.selected && styles.pickerOptionTextActive]}>
                {option.label}
              </Text>
              {option.selected ? <Ionicons name="checkmark" size={16} color={Colors.maroon} /> : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </>
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
