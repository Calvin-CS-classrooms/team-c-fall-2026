// Tests the rating helpers: rating ownership checks and author labels.
import type { Rating } from '@/types';
import { initialRatings } from '@/data/ratings';
import { getUserById } from '@/data/users';
import { ANONYMOUS_AUTHOR, isOwnRating, ratingAuthorLabel } from '@/utils/ratings';

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

describe('ratingAuthorLabel', () => {
  const users = [
    { id: 2, firstName: 'Noah', lastName: 'De Vries' },
    { id: 3, firstName: 'Grace', lastName: null },
  ];
  const findUser = (id: number) => users.find((user) => user.id === id);

  it('shows "Anonymous user" for an anonymous rating, even to its author', () => {
    const anonymous = makeRating({ userId: 1, isAnonymous: true });

    expect(ratingAuthorLabel(anonymous, { currentUserId: 2, findUser })).toBe(ANONYMOUS_AUTHOR);
    expect(ratingAuthorLabel(anonymous, { currentUserId: 1, findUser })).toBe(ANONYMOUS_AUTHOR);
  });

  it('shows "You" for your own public rating', () => {
    expect(ratingAuthorLabel(makeRating({ userId: 1 }), { currentUserId: 1, findUser })).toBe('You');
  });

  it("shows another student's first name and last initial", () => {
    expect(ratingAuthorLabel(makeRating({ userId: 2 }), { currentUserId: 1, findUser })).toBe('Noah D.');
  });

  it('shows just the first name when there is no last name', () => {
    expect(ratingAuthorLabel(makeRating({ userId: 3 }), { currentUserId: 1, findUser })).toBe('Grace');
  });

  it('shows "Calvin student" when the author is unknown', () => {
    expect(ratingAuthorLabel(makeRating({ userId: 99 }), { currentUserId: 1, findUser })).toBe('Calvin student');
  });

  it('is not anonymous when isAnonymous is missing (e.g. ratings from the server)', () => {
    const fromServer = makeRating({ userId: 2 });
    delete fromServer.isAnonymous;

    expect(ratingAuthorLabel(fromServer, { currentUserId: 1, findUser })).toBe('Noah D.');
  });
});

describe('seeded users', () => {
  it('has a user for every seeded rating', () => {
    for (const rating of initialRatings) {
      expect(getUserById(rating.userId)).toBeDefined();
    }
  });
});
