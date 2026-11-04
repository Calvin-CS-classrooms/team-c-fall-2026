import type { CampusLocation, UserRating } from '@/types';

export type DiscoveryFilter = 'now-open' | 'quiet' | 'trending';

export const DISCOVERY_FILTERS: { key: DiscoveryFilter; label: string }[] = [
  { key: 'now-open', label: 'Now Open' },
  { key: 'quiet', label: 'Quiet Spots' },
  { key: 'trending', label: 'Trending' },
];

/** A location is trending when it has community ratings within this window. */
export const TRENDING_WINDOW_MINUTES = 360;

export function isQuietSpot(location: CampusLocation): boolean {
  return location.density === 'quiet' || location.noise === 'whisper';
}

export function recentRatingCount(locationId: string, ratings: UserRating[]): number {
  return ratings.filter(
    (rating) => rating.locationId === locationId && rating.createdMinutesAgo <= TRENDING_WINDOW_MINUTES,
  ).length;
}

/** Keeps only locations meeting every active filter. With "trending" active, the busiest-rated come first. */
export function applyDiscoveryFilters(
  locations: CampusLocation[],
  ratings: UserRating[],
  filters: DiscoveryFilter[],
): CampusLocation[] {
  const active = new Set(filters);
  const result = locations.filter(
    (location) =>
      (!active.has('now-open') || location.isOpenNow) &&
      (!active.has('quiet') || isQuietSpot(location)) &&
      (!active.has('trending') || recentRatingCount(location.id, ratings) > 0),
  );

  if (active.has('trending')) {
    return [...result].sort(
      (a, b) => recentRatingCount(b.id, ratings) - recentRatingCount(a.id, ratings) || b.rating - a.rating,
    );
  }
  return result;
}
