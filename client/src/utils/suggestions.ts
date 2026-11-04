import type { CampusLocation, SpaceSuggestion, SuggestedAmenity } from '@/types';

/** Net positive votes (up minus down) needed for a suggestion to become an official space. */
export const PROMOTION_THRESHOLD = 5;

export function netScore(suggestion: SpaceSuggestion): number {
  return Object.values(suggestion.votes).reduce<number>((sum, vote) => sum + vote, 0);
}

export function amenityTally(amenity: SuggestedAmenity) {
  const values = Object.values(amenity.votes);
  return {
    keep: values.filter((vote) => vote === 'keep').length,
    remove: values.filter((vote) => vote === 'remove').length,
  };
}

function isSameDay(first: number, second: number): boolean {
  const a = new Date(first);
  const b = new Date(second);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Students are limited to one space suggestion per calendar day. */
export function hasSuggestedToday(suggestions: SpaceSuggestion[], email: string, now = Date.now()): boolean {
  return suggestions.some((suggestion) => suggestion.submittedBy === email && isSameDay(suggestion.submittedAt, now));
}

export function suggestionToLocation(suggestion: SpaceSuggestion): CampusLocation {
  const amenities = suggestion.amenities
    .filter((amenity) => {
      const { keep, remove } = amenityTally(amenity);
      return keep >= remove;
    })
    .map((amenity) => amenity.name);

  return {
    id: suggestion.id,
    name: suggestion.name,
    category: 'study',
    image: require('@/assets/images/calvin_logo.webp'),
    capacity: 0,
    density: 'quiet',
    noise: 'low-buzz',
    hoursLabel: 'Hours not yet reported',
    isOpenNow: true,
    rating: 0,
    shortDescription: suggestion.description,
    amenities: amenities.length > 0 ? amenities : ['Seating'],
    floors: [{ floor: 'Main Area', description: suggestion.usage, noise: 'low-buzz' }],
  };
}
