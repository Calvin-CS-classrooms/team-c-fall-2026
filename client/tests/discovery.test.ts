import { spaces } from '@/data/spaces';
import { initialRatings } from '@/data/ratings';
import type { Location, Space } from '@/types';
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

describe('Now Open filter', () => {
  // Two buildings: one open during the day, one only in the evening, and one with no hours.
  const building = (id: number, hours?: Location['hours']): Location => ({
    id,
    name: `Building ${id}`,
    image: undefined,
    description: '',
    numFloors: 1,
    numSpaces: 1,
    hours: hours as Location['hours'],
  });
  const buildings = [
    building(1, { openingTime: '07:00', closingTime: '22:00' }),
    building(2, { openingTime: '18:00', closingTime: '23:00' }),
    building(3),
  ];
  const findLocation = (id: number) => buildings.find((b) => b.id === id);
  const space = (id: number, locationId: number): Space => ({ ...spaces[0], id, locationId });
  const testSpaces = [space(1, 1), space(2, 2), space(3, 3)];
  const noon = new Date(2026, 10, 13, 12, 0);
  const evening = new Date(2026, 10, 13, 19, 0);

  it("keeps only spaces whose building is open at the current time", () => {
    const ids = (now: Date) =>
      applyDiscoveryFilters(testSpaces, [], ['now-open'], { now, findLocation })
        .map((s) => s.id)
        .filter((id) => id !== 3);

    expect(ids(noon)).toEqual([1]);
    expect(ids(evening)).toEqual([1, 2]);
  });

  it("keeps spaces whose building has no hours, since we can't tell", () => {
    const ids = applyDiscoveryFilters(testSpaces, [], ['now-open'], { now: noon, findLocation }).map((s) => s.id);

    expect(ids).toContain(3);
  });

  it('does not filter by hours when Now Open is off', () => {
    expect(applyDiscoveryFilters(testSpaces, [], [], { now: noon, findLocation })).toHaveLength(3);
  });

  it('combines with the other filters', () => {
    const quietClosed = { ...space(4, 2), noiseLevel: 'whisper' as const, currentNoiseLevel: 'whisper' as const };
    const quietOpen = { ...space(5, 1), noiseLevel: 'whisper' as const, currentNoiseLevel: 'whisper' as const };

    const ids = applyDiscoveryFilters([...testSpaces, quietClosed, quietOpen], [], ['now-open', 'quiet'], {
      now: noon,
      findLocation,
    }).map((s) => s.id);

    expect(ids).toContain(5);
    expect(ids).not.toContain(4);
  });
});
