import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CapacitySlider } from '@/components/capacity-slider';
import { Chip } from '@/components/chip';
import { StarRating } from '@/components/star-rating';
import { Colors, NoiseLabels } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { locations } from '@/data/locations';
import type { NewRatingInput, NoiseLevel } from '@/types';

const NOISE_LEVELS: NoiseLevel[] = ['whisper', 'low-buzz', 'social', 'loud'];
const AMENITY_OPTIONS = ['Wi-Fi', 'Outlets', 'Seating', 'Quiet', 'Group Friendly', 'Food Nearby'];

interface RatingFormProps {
  initialLocationId?: string;
  onSubmit: (input: NewRatingInput) => void;
  submitLabel?: string;
}

export function RatingForm({ initialLocationId, onSubmit, submitLabel = 'Submit Rating' }: RatingFormProps) {
  const [locationId, setLocationId] = useState(initialLocationId ?? locations[0].id);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [capacity, setCapacity] = useState(50);
  const [noise, setNoise] = useState<NoiseLevel>('low-buzz');
  const [stars, setStars] = useState(4);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const selectedLocation = locations.find((location) => location.id === locationId) ?? locations[0];

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]));
  };

  const handleSubmit = () => {
    onSubmit({
      locationId: selectedLocation.id,
      locationName: selectedLocation.name,
      stars,
      capacity,
      noise,
      amenities,
      comment: comment.trim() || undefined,
    });
    setComment('');
    setAmenities([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      <Pressable style={styles.picker} onPress={() => setPickerOpen((open) => !open)}>
        <View style={styles.pickerLeft}>
          <Ionicons name="location-outline" size={16} color={Colors.maroon} />
          <Text style={styles.pickerText}>{selectedLocation.name}</Text>
        </View>
        <Ionicons name={pickerOpen ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
      </Pressable>
      {pickerOpen ? (
        <View style={styles.pickerList}>
          {locations.map((location) => (
            <Pressable
              key={location.id}
              style={styles.pickerOption}
              onPress={() => {
                setLocationId(location.id);
                setPickerOpen(false);
              }}>
              <Text
                style={[styles.pickerOptionText, location.id === locationId && styles.pickerOptionTextActive]}>
                {location.name}
              </Text>
              {location.id === locationId ? <Ionicons name="checkmark" size={16} color={Colors.maroon} /> : null}
            </Pressable>
          ))}
        </View>
      ) : null}

      <Text style={styles.label}>Overall Rating</Text>
      <StarRating value={stars} onChange={setStars} size={28} />

      <Text style={styles.label}>Capacity</Text>
      <CapacitySlider value={capacity} onChange={setCapacity} />

      <Text style={styles.label}>Noise Level</Text>
      <View style={styles.chipRow}>
        {NOISE_LEVELS.map((level) => (
          <Chip key={level} label={NoiseLabels[level]} selected={noise === level} onPress={() => setNoise(level)} />
        ))}
      </View>

      <Text style={styles.label}>Amenities</Text>
      <View style={styles.chipRow}>
        {AMENITY_OPTIONS.map((amenity) => (
          <Chip
            key={amenity}
            label={amenity}
            selected={amenities.includes(amenity)}
            onPress={() => toggleAmenity(amenity)}
          />
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
