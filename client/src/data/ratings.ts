import type { UserRating } from '@/types';

export const initialRatings: UserRating[] = [
  {
    id: 'rating-1',
    locationId: 'hekman-library',
    locationName: 'Hekman Library',
    stars: 5,
    capacity: 40,
    noise: 'whisper',
    amenities: ['Silent Floor', 'Outlets'],
    comment: 'Floor 4 was empty and perfectly quiet before finals week.',
    helpfulCount: 14,
    createdMinutesAgo: 95,
  },
  {
    id: 'rating-2',
    locationId: 'commons-dining-hall',
    locationName: 'Commons Dining Hall',
    stars: 3,
    capacity: 88,
    noise: 'loud',
    amenities: ['Seating 300+'],
    comment: 'Packed at lunch, but the new pasta station is worth the wait.',
    helpfulCount: 9,
    createdMinutesAgo: 480,
  },
  {
    id: 'rating-3',
    locationId: 'peets-coffee',
    locationName: "Peet's Coffee",
    stars: 4,
    capacity: 30,
    noise: 'low-buzz',
    amenities: ['Mobile Order', 'Study Seating'],
    helpfulCount: 5,
    createdMinutesAgo: 1420,
  },
];
