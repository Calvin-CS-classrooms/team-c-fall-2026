// Keeps each space's rating, crowd level, and noise level up to date as
// ratings are added and deleted after the app loads.

import type { Rating, Space } from '@/types';

/**
 * Returns the spaces with their metrics adjusted for ratings added or deleted
 * since the app loaded.
 *
 * Each space arrives with an `overallRating` already computed (by the server,
 * or seeded in the bundled data), plus the ratings loaded alongside it. That
 * starting value is treated as the average of its loaded ratings, counting as
 * at least one rating so a seeded value with nothing behind it still has
 * weight. Added ratings are averaged in and deleted ones taken out:
 *
 *   (start * weight + added stars - deleted stars) / (weight + added - deleted)
 *
 * With server data the starting value really is that average, so this gives
 * the exact new average. Crowd level and noise come from the newest rating
 * added since loading; until there is one, the loaded values stay.
 *
 * @param spaces - Spaces as loaded, with their starting metrics.
 * @param loadedRatings - The ratings that were loaded with those spaces.
 * @param currentRatings - The ratings now, after any adds and deletes.
 */
export function withLiveMetrics(spaces: Space[], loadedRatings: Rating[], currentRatings: Rating[]): Space[] {
  const loadedIds = new Set(loadedRatings.map((rating) => rating.id));
  const currentIds = new Set(currentRatings.map((rating) => rating.id));

  const added = currentRatings.filter((rating) => !loadedIds.has(rating.id));
  const deleted = loadedRatings.filter((rating) => !currentIds.has(rating.id));

  // Nothing changed since loading: keep the spaces exactly as they are.
  if (added.length === 0 && deleted.length === 0) return spaces;

  return spaces.map((space) => {
    const addedHere = added.filter((rating) => rating.spaceId === space.id);
    const deletedHere = deleted.filter((rating) => rating.spaceId === space.id);
    if (addedHere.length === 0 && deletedHere.length === 0) return space;

    const loadedCount = loadedRatings.filter((rating) => rating.spaceId === space.id).length;
    const weight = Math.max(loadedCount, 1);
    const sumStars = (ratings: Rating[]) => ratings.reduce((sum, rating) => sum + rating.numStars, 0);

    const count = weight + addedHere.length - deletedHere.length;
    const total = space.overallRating * weight + sumStars(addedHere) - sumStars(deletedHere);
    const overallRating = count > 0 ? Math.round((total / count) * 10) / 10 : 0;

    const newest = [...addedHere].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

    return {
      ...space,
      overallRating,
      crowdRating: newest ? newest.crowdRating : space.crowdRating,
      currentNoiseLevel: newest ? newest.perceivedNoise : space.currentNoiseLevel,
    };
  });
}
