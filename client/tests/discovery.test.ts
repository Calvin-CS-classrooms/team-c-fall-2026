import { locations } from '@/data/locations';
import { initialRatings } from '@/data/ratings';
import { applyDiscoveryFilters, isQuietSpot, recentRatingCount } from '@/utils/discovery';
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
