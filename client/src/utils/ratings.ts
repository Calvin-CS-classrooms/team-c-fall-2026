import type { Rating, User } from '@/types';

export const ANONYMOUS_AUTHOR = 'Anonymous user';

/** Whether the given rating was authored by the given user id. */
export function isOwnRating(rating: Rating, userId: number | null | undefined): boolean {
  return Boolean(userId) && rating.userId === userId;
}

/** Shown for authors we have no name for. */
export const UNKNOWN_AUTHOR = 'Calvin student';

interface AuthorLookup {
  /** The signed-in user's id, if any. */
  currentUserId: number | null | undefined;
  /** Looks up another user's name by id (e.g. getUserById). */
  findUser: (id: number) => Pick<User, 'firstName' | 'lastName'> | undefined;
}

/**
 * Who to show as a rating's author.
 *
 * Anonymous ratings always show "Anonymous user", even to their author, so a
 * screenshot never reveals who wrote one. Otherwise your own ratings show
 * "You" and other students show as first name and last initial ("Noah D.").
 */
export function ratingAuthorLabel(rating: Rating, { currentUserId, findUser }: AuthorLookup): string {
  if (rating.isAnonymous) return ANONYMOUS_AUTHOR;
  if (isOwnRating(rating, currentUserId)) return 'You';

  const user = findUser(rating.userId);
  if (!user) return UNKNOWN_AUTHOR;
  return user.lastName ? `${user.firstName} ${user.lastName[0]}.` : user.firstName;
}
