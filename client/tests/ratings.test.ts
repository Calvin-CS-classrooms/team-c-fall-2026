// Tests the rating helpers: blending community stars into a location's score,
// author labels for anonymous ratings, and rating ownership checks.
import type { UserRating } from '@/types';
import {
  ANONYMOUS_AUTHOR,
  BASELINE_RATING_WEIGHT,
  computeLocationRating,
  isOwnRating,
  ratingAuthorLabel,
} from '@/utils/ratings';

function makeRating(overrides: Partial<UserRating> = {}): UserRating {
  return {
    id: 'rating-test',
    locationId: 'hekman-library',
    locationName: 'Hekman Library',
    stars: 4,
    capacity: 50,
    noise: 'low-buzz',
    amenities: [],
    helpfulCount: 0,
    createdMinutesAgo: 10,
    ownerEmail: 'student@calvin.edu',
    ownerName: 'Student S.',
    isAnonymous: false,
    ...overrides,
  };
}

describe('computeLocationRating', () => {
  it('returns 0 when there is no baseline and no ratings', () => {
    expect(computeLocationRating(0, [])).toBe(0);
  });

  it('weights the baseline as BASELINE_RATING_WEIGHT ratings', () => {
    // A 5-star baseline counted BASELINE_RATING_WEIGHT times plus one 1-star rating.
    const expected = (5 * BASELINE_RATING_WEIGHT + 1) / (BASELINE_RATING_WEIGHT + 1);
    expect(computeLocationRating(5, [1])).toBeCloseTo(expected, 1);
  });

  it('moves toward the community average as more ratings come in', () => {
    const few = computeLocationRating(3, [5]);
    const many = computeLocationRating(3, Array(20).fill(5));

    expect(few).toBeGreaterThan(3);
    expect(many).toBeGreaterThan(few);
    expect(many).toBeLessThanOrEqual(5);
  });

  it('rounds to one decimal place', () => {
    const result = computeLocationRating(0, [5, 4, 4]);
    expect(result).toBe(4.3);
    expect(Number.isInteger(result * 10)).toBe(true);
  });
});

describe('ratingAuthorLabel', () => {
  it('shows the owner name for a public rating', () => {
    expect(ratingAuthorLabel(makeRating())).toBe('Student S.');
  });

  it('hides the name when the rating is anonymous', () => {
    expect(ratingAuthorLabel(makeRating({ isAnonymous: true }))).toBe(ANONYMOUS_AUTHOR);
  });

  it('shows "Anonymous user" when the owner deleted their account', () => {
    expect(ratingAuthorLabel(makeRating({ ownerEmail: null }))).toBe(ANONYMOUS_AUTHOR);
  });

  it('shows "Anonymous user" when the rating has no owner name', () => {
    expect(ratingAuthorLabel(makeRating({ ownerName: undefined }))).toBe(ANONYMOUS_AUTHOR);
  });
});

describe('isOwnRating', () => {
  it('is true for the signed-in owner', () => {
    expect(isOwnRating(makeRating(), 'student@calvin.edu')).toBe(true);
  });

  it('is true for the owner even when the rating is anonymous', () => {
    expect(isOwnRating(makeRating({ isAnonymous: true }), 'student@calvin.edu')).toBe(true);
  });

  it('is false for a different user', () => {
    expect(isOwnRating(makeRating(), 'other@calvin.edu')).toBe(false);
  });

  it('is false when nobody is signed in', () => {
    expect(isOwnRating(makeRating(), null)).toBe(false);
    expect(isOwnRating(makeRating(), undefined)).toBe(false);
  });

  it('never matches an orphaned rating, even with an empty email', () => {
    expect(isOwnRating(makeRating({ ownerEmail: null }), '')).toBe(false);
  });
});
