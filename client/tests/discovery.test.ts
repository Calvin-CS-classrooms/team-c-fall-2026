import { spaces } from '@/data/spaces';
import { initialRatings } from '@/data/ratings';
import { applyDiscoveryFilters, isQuietSpot, recentRatingCount, TRENDING_WINDOW_MINUTES } from '@/utils/discovery';

describe('discovery filters', () => {
  it('returns every space with no filters active', () => {
    expect(applyDiscoveryFilters(spaces, initialRatings, [])).toHaveLength(spaces.length);
  });

  it('combines filters so results meet all active conditions', () => {
    const result = applyDiscoveryFilters(spaces, initialRatings, ['quiet', 'trending']);

    for (const space of result) {
      expect(isQuietSpot(space)).toBe(true);
      expect(recentRatingCount(space.id, initialRatings)).toBeGreaterThan(0);
    }
  });

  it('only includes recently rated spaces when trending', () => {
    const ids = applyDiscoveryFilters(spaces, initialRatings, ['trending']).map((space) => space.id);

    expect(ids).toEqual(expect.arrayContaining([4, 17]));
    expect(ids).not.toContain(20);
  });

  it('sorts trending spaces by recent rating count, then by rating', () => {
    const [first, second] = spaces;
    const recent = (spaceId: number, createdAt = new Date(Date.now() - 5 * 60 * 1000).toISOString()) => ({
      ...initialRatings[0],
      spaceId,
      createdAt,
    });
    const ratings = [recent(second.id), recent(second.id), recent(first.id)];

    const ids = applyDiscoveryFilters([first, second], ratings, ['trending']).map((space) => space.id);

    expect(ids).toEqual([second.id, first.id]);
  });

  it('does not count ratings older than the trending window', () => {
    const old = {
      ...initialRatings[0],
      createdAt: new Date(Date.now() - (TRENDING_WINDOW_MINUTES + 1) * 60 * 1000).toISOString(),
    };

    expect(recentRatingCount(old.spaceId, [old])).toBe(0);
    expect(
      recentRatingCount(old.spaceId, [
        { ...old, createdAt: new Date(Date.now() - TRENDING_WINDOW_MINUTES * 60 * 1000).toISOString() },
      ]),
    ).toBe(1);
  });

  it('does not reorder results when trending is off', () => {
    const result = applyDiscoveryFilters(spaces, initialRatings, ['quiet']);
    const expectedOrder = spaces.filter(isQuietSpot).map((space) => space.id);

    expect(result.map((space) => space.id)).toEqual(expectedOrder);
  });

  it('treats whisper or lowBuzz current noise as a quiet spot', () => {
    const base = spaces[0];

    expect(isQuietSpot({ ...base, currentNoiseLevel: 'whisper' })).toBe(true);
    expect(isQuietSpot({ ...base, currentNoiseLevel: 'lowBuzz' })).toBe(true);
    expect(isQuietSpot({ ...base, currentNoiseLevel: 'social' })).toBe(false);
  });

  it('returns an empty list for empty spaces', () => {
    expect(applyDiscoveryFilters([], initialRatings, ['quiet', 'trending'])).toEqual([]);
  });

  it('returns an empty list when no space is trending', () => {
    const noRecent = initialRatings.map((rating) => ({
      ...rating,
      createdAt: new Date(Date.now() - (TRENDING_WINDOW_MINUTES + 1) * 60 * 1000).toISOString(),
    }));
    expect(applyDiscoveryFilters(spaces, noRecent, ['trending'])).toEqual([]);
  });

  it('returns an empty list when no space is quiet', () => {
    const loudSpaces = spaces.map((space) => ({ ...space, currentNoiseLevel: 'loud' as const }));
    expect(applyDiscoveryFilters(loudSpaces, initialRatings, ['quiet'])).toEqual([]);
  });

  it('treats the trending window boundary as recent', () => {
    const boundary = {
      ...initialRatings[0],
      createdAt: new Date(Date.now() - TRENDING_WINDOW_MINUTES * 60 * 1000).toISOString(),
    };
    expect(recentRatingCount(boundary.spaceId, [boundary])).toBe(1);
  });

  it('counts multiple recent ratings for the same space', () => {
    const recent = (spaceId: number) => ({
      ...initialRatings[0],
      spaceId,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    });
    expect(recentRatingCount(1, [recent(1), recent(1), recent(1)])).toBe(3);
  });

  it('ignores ratings for other spaces when counting', () => {
    const recent = (spaceId: number) => ({
      ...initialRatings[0],
      spaceId,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    });
    expect(recentRatingCount(1, [recent(1), recent(2), recent(3)])).toBe(1);
  });

  it('breaks trending ties by overall rating', () => {
    const [first, second] = spaces;
    const recent = (spaceId: number) => ({
      ...initialRatings[0],
      spaceId,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    });
    // Both have one recent rating; the higher-rated space should come first.
    const ratings = [recent(first.id), recent(second.id)];
    const ids = applyDiscoveryFilters([first, second], ratings, ['trending']).map((space) => space.id);
    const higherRated = first.overallRating >= second.overallRating ? first.id : second.id;
    expect(ids[0]).toBe(higherRated);
  });
});
