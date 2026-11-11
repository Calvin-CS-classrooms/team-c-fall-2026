import { locations } from '@/data/locations';
import { initialRatings } from '@/data/ratings';
import { applyDiscoveryFilters, isQuietSpot, recentRatingCount, TRENDING_WINDOW_MINUTES } from '@/utils/discovery';
import { computeLocationRating, ratingAuthorLabel } from '@/utils/ratings';

describe('discovery filters', () => {
  it('returns every location with no filters active', () => {
    expect(applyDiscoveryFilters(locations, initialRatings, [])).toHaveLength(locations.length);
  });

  it('combines filters so results meet all active conditions', () => {
    const result = applyDiscoveryFilters(locations, initialRatings, ['now-open', 'quiet', 'trending']);

    for (const location of result) {
      expect(location.isOpenNow).toBe(true);
      expect(isQuietSpot(location)).toBe(true);
      expect(recentRatingCount(location.id, initialRatings)).toBeGreaterThan(0);
    }
  });

  it('only includes recently rated locations when trending', () => {
    const ids = applyDiscoveryFilters(locations, initialRatings, ['trending']).map((location) => location.id);

    expect(ids).toEqual(expect.arrayContaining(['hekman-library', 'morren-fitness']));
    expect(ids).not.toContain('peets-coffee');
  });

  it('keeps only open locations with "now-open"', () => {
    const result = applyDiscoveryFilters(locations, initialRatings, ['now-open']);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((location) => location.isOpenNow)).toBe(true);
    expect(result).toHaveLength(locations.filter((location) => location.isOpenNow).length);
  });

  it('sorts trending locations by recent rating count, then by rating', () => {
    const [first, second] = locations;
    const recent = (locationId: string, createdMinutesAgo = 5) => ({
      ...initialRatings[0],
      locationId,
      createdMinutesAgo,
    });
    const ratings = [recent(second.id), recent(second.id), recent(first.id)];

    const ids = applyDiscoveryFilters([first, second], ratings, ['trending']).map((location) => location.id);

    expect(ids).toEqual([second.id, first.id]);
  });

  it('does not count ratings older than the trending window', () => {
    const old = { ...initialRatings[0], createdMinutesAgo: TRENDING_WINDOW_MINUTES + 1 };

    expect(recentRatingCount(old.locationId, [old])).toBe(0);
    expect(recentRatingCount(old.locationId, [{ ...old, createdMinutesAgo: TRENDING_WINDOW_MINUTES }])).toBe(1);
  });

  it('does not reorder results when trending is off', () => {
    const result = applyDiscoveryFilters(locations, initialRatings, ['quiet']);
    const expectedOrder = locations.filter(isQuietSpot).map((location) => location.id);

    expect(result.map((location) => location.id)).toEqual(expectedOrder);
  });

  it('treats whisper noise or quiet density as a quiet spot', () => {
    const base = locations[0];

    expect(isQuietSpot({ ...base, density: 'quiet', noise: 'loud' })).toBe(true);
    expect(isQuietSpot({ ...base, density: 'busy', noise: 'whisper' })).toBe(true);
    expect(isQuietSpot({ ...base, density: 'busy', noise: 'social' })).toBe(false);
  });
});

describe('rating helpers', () => {
  it('blends community ratings into the baseline score', () => {
    expect(computeLocationRating(4, [])).toBe(4);
    expect(computeLocationRating(4, [5])).toBeCloseTo(4.2);
    expect(computeLocationRating(0, [3, 5])).toBe(4);
  });

  it('hides the owner of anonymous ratings', () => {
    const anonymous = initialRatings.find((rating) => rating.isAnonymous)!;
    const named = initialRatings.find((rating) => !rating.isAnonymous)!;

    expect(ratingAuthorLabel(anonymous)).toBe('Anonymous user');
    expect(ratingAuthorLabel(named)).toBe(named.ownerName);
  });
});
