// Tests the space-suggestion helpers: the one-per-day limit.
import { createInitialSuggestions } from '@/data/suggestions';
import type { SpotSuggestion } from '@/types';
import { hasSuggestedToday } from '@/utils/suggestions';

/** Builds a suggestion with sensible defaults so each test only sets the fields it cares about. */
function makeSuggestion(overrides: Partial<SpotSuggestion> = {}): SpotSuggestion {
  return {
    id: 1,
    userId: 1,
    locationId: 1,
    name: 'Test Lounge',
    description: 'A lounge used for testing.',
    type: 'addition',
    createdAt: new Date(2026, 10, 11, 12, 0).toISOString(),
    numUpvotes: 0,
    status: 'beingTested',
    ...overrides,
  };
}

describe('hasSuggestedToday', () => {
  const now = new Date(2026, 10, 11, 15, 30).getTime();

  it('is true when the user already submitted earlier the same calendar day', () => {
    const morning = makeSuggestion({ createdAt: new Date(2026, 10, 11, 8, 0).toISOString() });
    expect(hasSuggestedToday([morning], 1, now)).toBe(true);
  });

  it('is false for a submission from the previous calendar day, even if less than 24 hours ago', () => {
    const lateLastNight = makeSuggestion({ createdAt: new Date(2026, 10, 10, 23, 59).toISOString() });
    expect(hasSuggestedToday([lateLastNight], 1, now)).toBe(false);
  });

  it('ignores suggestions submitted by other students', () => {
    const someoneElse = makeSuggestion({ userId: 2, createdAt: new Date(now).toISOString() });
    expect(hasSuggestedToday([someoneElse], 1, now)).toBe(false);
  });

  it('is false with no suggestions at all', () => {
    expect(hasSuggestedToday([], 1, now)).toBe(false);
  });

  it('is true when the user has multiple suggestions, any of which is today', () => {
    const yesterday = makeSuggestion({ createdAt: new Date(2026, 10, 10, 12, 0).toISOString() });
    const today = makeSuggestion({ id: 2, createdAt: new Date(2026, 10, 11, 9, 0).toISOString() });
    expect(hasSuggestedToday([yesterday, today], 1, now)).toBe(true);
  });

  it('is false when the user has suggestions but none are today', () => {
    const older = makeSuggestion({ createdAt: new Date(2026, 10, 9, 12, 0).toISOString() });
    const yesterday = makeSuggestion({ id: 2, createdAt: new Date(2026, 10, 10, 12, 0).toISOString() });
    expect(hasSuggestedToday([older, yesterday], 1, now)).toBe(false);
  });

  it('is true exactly at midnight of the same day', () => {
    const midnight = makeSuggestion({ createdAt: new Date(2026, 10, 11, 0, 0).toISOString() });
    expect(hasSuggestedToday([midnight], 1, now)).toBe(true);
  });

  it('is false for a suggestion at 23:59 the previous day', () => {
    const late = makeSuggestion({ createdAt: new Date(2026, 10, 10, 23, 59).toISOString() });
    expect(hasSuggestedToday([late], 1, now)).toBe(false);
  });
});

describe('createInitialSuggestions', () => {
  it('creates suggestions with the new SpotSuggestion shape', () => {
    const suggestions = createInitialSuggestions(Date.now());
    expect(suggestions.length).toBeGreaterThan(0);
    for (const suggestion of suggestions) {
      expect(suggestion.id).toBeDefined();
      expect(suggestion.userId).toBeDefined();
      expect(suggestion.locationId).toBeDefined();
      expect(suggestion.name).toBeDefined();
      expect(suggestion.type).toBe('addition');
      expect(suggestion.numUpvotes).toBeGreaterThanOrEqual(0);
    }
  });
});
