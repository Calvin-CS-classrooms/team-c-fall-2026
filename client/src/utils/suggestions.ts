import type { SpotSuggestion } from '@/types';

/** Net positive votes (up minus down) needed for a suggestion to become an official space. */
export const PROMOTION_THRESHOLD = 5;

function isSameDay(first: number, second: number): boolean {
  const a = new Date(first);
  const b = new Date(second);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Students are limited to one space suggestion per calendar day. */
export function hasSuggestedToday(suggestions: SpotSuggestion[], userId: number, now = Date.now()): boolean {
  return suggestions.some(
    (suggestion) => suggestion.userId === userId && isSameDay(new Date(suggestion.createdAt).getTime(), now),
  );
}
