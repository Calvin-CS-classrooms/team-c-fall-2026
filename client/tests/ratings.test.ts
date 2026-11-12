// Tests the rating helpers: rating ownership checks.
import type { Rating } from '@/types';
import { isOwnRating } from '@/utils/ratings';

function makeRating(overrides: Partial<Rating> = {}): Rating {
  return {
    id: 1,
    userId: 1,
    spaceId: 4,
    createdAt: new Date().toISOString(),
    numStars: 4,
    crowdRating: 50,
    perceivedNoise: 'lowBuzz',
    description: 'A test rating.',
    numUpvotes: 0,
    ...overrides,
  };
}

describe('isOwnRating', () => {
  it('is true for the signed-in owner', () => {
    expect(isOwnRating(makeRating(), 1)).toBe(true);
  });

  it('is false for a different user', () => {
    expect(isOwnRating(makeRating(), 2)).toBe(false);
  });

  it('is false when nobody is signed in', () => {
    expect(isOwnRating(makeRating(), null)).toBe(false);
    expect(isOwnRating(makeRating(), undefined)).toBe(false);
  });

  it('is false when the user id is 0 or a falsy value', () => {
    expect(isOwnRating(makeRating(), 0)).toBe(false);
  });

  it('is true only for an exact user id match', () => {
    expect(isOwnRating(makeRating({ userId: 7 }), 7)).toBe(true);
    expect(isOwnRating(makeRating({ userId: 7 }), 8)).toBe(false);
  });
});
