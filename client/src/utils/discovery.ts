import { getLocationById } from '@/data/locations';
import type { Location, Rating, Space } from '@/types';
import { isOpenAt } from '@/utils/hours';

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
/** Inputs for Now Open; tests pass a fixed time and their own buildings. */
export interface DiscoveryOptions {
  now?: Date;
  findLocation?: (id: number) => Location | undefined;
}

/**
 * Whether a space's building is open at `now`. Buildings without usable hours
 * (e.g. locations loaded from Supabase, which has no hours columns yet) count
 * as open, so Now Open never hides places we cannot judge.
 */
export function isSpaceOpen(space: Space, now: Date, findLocation: (id: number) => Location | undefined): boolean {
  return isOpenAt(findLocation(space.locationId)?.hours, now) ?? true;
}

export function applyDiscoveryFilters(
  spaces: Space[],
  ratings: Rating[],
  filters: DiscoveryFilter[],
  { now = new Date(), findLocation = getLocationById }: DiscoveryOptions = {},
): Space[] {
  const active = new Set(filters);
  const result = spaces.filter(
    (space) =>
      (!active.has('now-open') || isSpaceOpen(space, now, findLocation)) &&
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
