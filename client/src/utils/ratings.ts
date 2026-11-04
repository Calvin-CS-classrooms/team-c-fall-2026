import type { UserRating } from '@/types';

/** How many ratings the seeded baseline score counts as when blending in community ratings. */
export const BASELINE_RATING_WEIGHT = 5;

export const ANONYMOUS_AUTHOR = 'Anonymous user';

export function computeLocationRating(baseRating: number, stars: number[]): number {
  const baseWeight = baseRating > 0 ? BASELINE_RATING_WEIGHT : 0;
  const count = baseWeight + stars.length;
  if (count === 0) return 0;
  const total = baseRating * baseWeight + stars.reduce((sum, value) => sum + value, 0);
  return Math.round((total / count) * 10) / 10;
}

export function ratingAuthorLabel(rating: UserRating): string {
  if (rating.isAnonymous || !rating.ownerEmail || !rating.ownerName) return ANONYMOUS_AUTHOR;
  return rating.ownerName;
}

export function isOwnRating(rating: UserRating, email: string | null | undefined): boolean {
  return Boolean(email) && rating.ownerEmail === email;
}
