// Opening-hours helpers for buildings.

import type { LocationHours } from '@/types';

// "07:30" -> 450 (minutes after midnight), or undefined when not HH:MM.
function minutesFromTime(time: string | undefined): number | undefined {
  const match = /^(\d{2}):(\d{2})$/.exec(time ?? '');
  if (!match) return undefined;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return undefined;
  return hours * 60 + minutes;
}

/**
 * Whether a building with these hours is open at `date` (local time).
 *
 * Open from the opening time up to, but not including, the closing time. A
 * closing time at or before the opening time means the hours run past
 * midnight (e.g. 07:00-01:00), and equal times mean open all day.
 *
 * @returns true or false, or undefined when the hours are missing or not in HH:MM form.
 */
export function isOpenAt(hours: LocationHours | undefined, date: Date): boolean | undefined {
  const opens = minutesFromTime(hours?.openingTime);
  const closes = minutesFromTime(hours?.closingTime);
  if (opens === undefined || closes === undefined) return undefined;

  const now = date.getHours() * 60 + date.getMinutes();
  if (opens < closes) {
    return now >= opens && now < closes;
  }
  // Runs past midnight (or all day when opens === closes).
  return now >= opens || now < closes;
}
