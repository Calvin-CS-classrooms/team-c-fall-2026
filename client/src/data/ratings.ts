import type { Rating } from '@/types';

// Bundled ratings, used when the server is unreachable. Replaced with the
// server's ratings at startup by loadCampusData (src/services/campus-api.ts).
export let initialRatings: Rating[] = [
  {
    id: 1,
    userId: 1,
    spaceId: 4,
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    numStars: 5,
    crowdRating: 40,
    perceivedNoise: 'whisper',
    description: 'Floor 4 was empty and perfectly quiet before finals week.',
    numUpvotes: 14,
  },
  {
    id: 2,
    userId: 2,
    spaceId: 17,
    createdAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    numStars: 4,
    crowdRating: 55,
    perceivedNoise: 'loud',
    description: 'The weight room has plenty of space this afternoon.',
    numUpvotes: 3,
  },
  {
    id: 3,
    userId: 3,
    spaceId: 5,
    createdAt: new Date(Date.now() - 480 * 60 * 1000).toISOString(),
    numStars: 3,
    crowdRating: 88,
    perceivedNoise: 'loud',
    description: 'Packed at lunch, but the new pasta station is worth the wait.',
    numUpvotes: 9,
    isAnonymous: true,
  },
  {
    id: 4,
    userId: 4,
    spaceId: 20,
    createdAt: new Date(Date.now() - 1420 * 60 * 1000).toISOString(),
    numStars: 4,
    crowdRating: 30,
    perceivedNoise: 'lowBuzz',
    description: 'Short line, mobile orders ready in under 5 minutes.',
    numUpvotes: 5,
  },
];

/** Replaces the starting ratings, e.g. with the server's data. Call before AppProvider mounts. */
export function setInitialRatings(nextRatings: Rating[]) {
  initialRatings = nextRatings;
}
