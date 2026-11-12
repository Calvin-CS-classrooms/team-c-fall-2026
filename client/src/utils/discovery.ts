import type { Rating, Space } from '@/types';

export type DiscoveryFilter = 'now-open' | 'quiet' | 'trending';

export const DISCOVERY_FILTERS: { key: DiscoveryFilter; label: string }[] = [
  { key: 'now-open', label: 'Now Open' },
  { key: 'quiet', label: 'Quiet Spots' },
  { key: 'trending', label: 'Trending' },
];

/** A space is trending when it has community ratings within this window. */
export const TRENDING_WINDOW_MINUTES = 360;

export function isQuietSpot(space: Space): boolean {
  return space.currentNoiseLevel === 'whisper' || space.currentNoiseLevel === 'lowBuzz';
}

export function recentRatingCount(spaceId: number, ratings: Rating[]): number {
  const cutoff = Date.now() - TRENDING_WINDOW_MINUTES * 60 * 1000;
  return ratings.filter(
    (rating) => rating.spaceId === spaceId && new Date(rating.createdAt).getTime() >= cutoff,
  ).length;
}

/** Keeps only spaces meeting every active filter. With "trending" active, the busiest-rated come first. */
export function applyDiscoveryFilters(
  spaces: Space[],
  ratings: Rating[],
  filters: DiscoveryFilter[],
): Space[] {
  const active = new Set(filters);
  const result = spaces.filter(
    (space) =>
      (!active.has('quiet') || isQuietSpot(space)) &&
      (!active.has('trending') || recentRatingCount(space.id, ratings) > 0),
  );

  if (active.has('trending')) {
    return [...result].sort(
      (a, b) => recentRatingCount(b.id, ratings) - recentRatingCount(a.id, ratings) || b.overallRating - a.overallRating,
    );
  }
  return result;
}
