import type { ActivityFeedItem } from '@/types';

export const activityFeed: ActivityFeedItem[] = [
  {
    id: 'activity-1',
    locationId: 'hekman-library',
    locationName: 'Hekman Library',
    message: 'Floor 4 is silent and nearly empty — great for finals prep.',
    noise: 'whisper',
    minutesAgo: 3,
  },
  {
    id: 'activity-2',
    locationId: 'commons-dining-hall',
    locationName: 'Commons Dining Hall',
    message: 'Line at the grill station is moving slowly right now.',
    noise: 'social',
    waitMinutes: 12,
    minutesAgo: 6,
  },
  {
    id: 'activity-3',
    locationId: 'peets-coffee',
    locationName: "Peet's Coffee",
    message: 'Short line, mobile orders ready in under 5 minutes.',
    noise: 'low-buzz',
    waitMinutes: 4,
    minutesAgo: 11,
  },
  {
    id: 'activity-4',
    locationId: 'morren-fitness',
    locationName: 'Morren Fitness Center',
    message: 'Weight room is packed, but the track upstairs is wide open.',
    noise: 'loud',
    minutesAgo: 18,
  },
  {
    id: 'activity-5',
    locationId: 'hekman-library',
    locationName: 'Hekman Library',
    message: 'Group rooms on Floor 3 are booked solid until 9 PM.',
    noise: 'social',
    minutesAgo: 27,
  },
];
