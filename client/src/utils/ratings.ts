import type { Rating } from '@/types';

export const ANONYMOUS_AUTHOR = 'Anonymous user';

/** Whether the given rating was authored by the given user id. */
export function isOwnRating(rating: Rating, userId: number | null | undefined): boolean {
  return Boolean(userId) && rating.userId === userId;
}
