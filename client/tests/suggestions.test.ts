// Tests the space-suggestion helpers: vote scoring, amenity tallies, the one-per-day limit,
// and converting a promoted suggestion into an official campus location.
import { createInitialSuggestions } from '@/data/suggestions';
import type { SpaceSuggestion, SuggestedAmenity } from '@/types';
import {
  amenityTally,
  hasSuggestedToday,
  netScore,
  PROMOTION_THRESHOLD,
  suggestionToLocation,
} from '@/utils/suggestions';

/** Builds a suggestion with sensible defaults so each test only sets the fields it cares about. */
function makeSuggestion(overrides: Partial<SpaceSuggestion> = {}): SpaceSuggestion {
  return {
    id: 'suggestion-test',
    name: 'Test Lounge',
    description: 'A lounge used for testing.',
    usage: 'Quiet reading between classes.',
    amenities: [],
    submittedBy: 'tester@calvin.edu',
    submittedAt: new Date(2026, 10, 11, 12, 0).getTime(),
    votes: {},
    status: 'pending',
    ...overrides,
  };
}

describe('netScore', () => {
  it('is zero when nobody has voted', () => {
    expect(netScore(makeSuggestion())).toBe(0);
  });

  it('subtracts downvotes from upvotes', () => {
    const suggestion = makeSuggestion({
      votes: { 'a@calvin.edu': 1, 'b@calvin.edu': 1, 'c@calvin.edu': -1 },
    });
    expect(netScore(suggestion)).toBe(1);
  });

  it('can go negative', () => {
    const suggestion = makeSuggestion({ votes: { 'a@calvin.edu': -1, 'b@calvin.edu': -1 } });
    expect(netScore(suggestion)).toBe(-2);
  });

  it('scores the seeded atrium suggestion one vote below the promotion threshold', () => {
    const [atrium] = createInitialSuggestions(Date.now());
    expect(netScore(atrium)).toBe(PROMOTION_THRESHOLD - 1);
  });
});

describe('amenityTally', () => {
  it('counts keep and remove votes separately', () => {
    const amenity: SuggestedAmenity = {
      name: 'Outlets',
      votes: { 'a@calvin.edu': 'keep', 'b@calvin.edu': 'keep', 'c@calvin.edu': 'remove' },
    };
    expect(amenityTally(amenity)).toEqual({ keep: 2, remove: 1 });
  });

  it('returns zeros when an amenity has no votes', () => {
    expect(amenityTally({ name: 'Couches', votes: {} })).toEqual({ keep: 0, remove: 0 });
  });
});

describe('hasSuggestedToday', () => {
  const now = new Date(2026, 10, 11, 15, 30).getTime();

  it('is true when the user already submitted earlier the same calendar day', () => {
    const morning = makeSuggestion({ submittedAt: new Date(2026, 10, 11, 8, 0).getTime() });
    expect(hasSuggestedToday([morning], 'tester@calvin.edu', now)).toBe(true);
  });

  it('is false for a submission from the previous calendar day, even if less than 24 hours ago', () => {
    const lateLastNight = makeSuggestion({ submittedAt: new Date(2026, 10, 10, 23, 59).getTime() });
    expect(hasSuggestedToday([lateLastNight], 'tester@calvin.edu', now)).toBe(false);
  });

  it('ignores suggestions submitted by other students', () => {
    const someoneElse = makeSuggestion({ submittedBy: 'other@calvin.edu', submittedAt: now });
    expect(hasSuggestedToday([someoneElse], 'tester@calvin.edu', now)).toBe(false);
  });

  it('ignores suggestions whose owner was removed by account deletion', () => {
    const orphaned = makeSuggestion({ submittedBy: null, submittedAt: now });
    expect(hasSuggestedToday([orphaned], 'tester@calvin.edu', now)).toBe(false);
  });

  it('is false with no suggestions at all', () => {
    expect(hasSuggestedToday([], 'tester@calvin.edu', now)).toBe(false);
  });
});

describe('suggestionToLocation', () => {
  it('copies the suggestion identity and description into a new study location', () => {
    const location = suggestionToLocation(makeSuggestion());

    expect(location.id).toBe('suggestion-test');
    expect(location.name).toBe('Test Lounge');
    expect(location.category).toBe('study');
    expect(location.shortDescription).toBe('A lounge used for testing.');
    expect(location.floors).toEqual([
      { floor: 'Main Area', description: 'Quiet reading between classes.', noise: 'low-buzz' },
    ]);
    expect(location.rating).toBe(0);
    expect(location.image).toBeDefined();
  });

  it('keeps amenities with at least as many keep votes as remove votes', () => {
    const location = suggestionToLocation(
      makeSuggestion({
        amenities: [
          { name: 'Outlets', votes: { a: 'keep', b: 'keep' } },
          { name: 'Tie Vote', votes: { a: 'keep', b: 'remove' } },
          { name: 'Vending Machines', votes: { a: 'remove', b: 'remove' } },
        ],
      }),
    );

    expect(location.amenities).toEqual(['Outlets', 'Tie Vote']);
  });

  it('falls back to "Seating" when every amenity was voted off', () => {
    const location = suggestionToLocation(
      makeSuggestion({ amenities: [{ name: 'Vending Machines', votes: { a: 'remove' } }] }),
    );

    expect(location.amenities).toEqual(['Seating']);
  });
});
