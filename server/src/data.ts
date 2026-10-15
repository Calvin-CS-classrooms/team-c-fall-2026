export type NoiseLevel = 'whisper' | 'low-buzz' | 'social' | 'loud';
export type Category = 'study' | 'dining' | 'athletics' | 'events';
export type DensityLevel = 'quiet' | 'moderate' | 'busy';

export interface FloorGuide {
  floor: string;
  description: string;
  noise: NoiseLevel;
}

// The JSON representation excludes the client's Metro image asset.
export interface ApiCampusLocation {
  id: string;
  name: string;
  category: Category;
  capacity: number;
  density: DensityLevel;
  noise: NoiseLevel;
  hoursLabel: string;
  isOpenNow: boolean;
  rating: number;
  waitTimeMinutes?: number;
  shortDescription: string;
  amenities: string[];
  floors: FloorGuide[];
}

export interface ApiUserRating {
  id: string;
  locationId: string;
  locationName: string;
  stars: number;
  capacity: number;
  noise: NoiseLevel;
  amenities: string[];
  comment?: string;
  helpfulCount: number;
  createdMinutesAgo: number;
}

// These fixture values mirror the client; capacity and open status are not live measurements.
export const mockLocations: ApiCampusLocation[] = [
  {
    id: 'hekman-library',
    name: 'Hekman Library',
    category: 'study',
    capacity: 62,
    density: 'moderate',
    noise: 'low-buzz',
    hoursLabel: 'Open until 1:00 AM',
    isOpenNow: true,
    rating: 4.6,
    shortDescription: 'Four floors of study space, from silent stacks to group rooms.',
    amenities: ['Wi-Fi', 'Printing', 'Group Rooms', 'Silent Floor', 'Outlets'],
    floors: [
      { floor: 'Floor 1 - Commons', description: 'Group tables, service desk, and cafe seating.', noise: 'social' },
      { floor: 'Floor 2 - Reading Room', description: 'Long tables and lounge chairs for focused work.', noise: 'low-buzz' },
      { floor: 'Floor 3 - Group Study', description: 'Bookable group rooms and whiteboards.', noise: 'social' },
      { floor: 'Floor 4 - Silent Floor', description: 'No talking, phones on silent only.', noise: 'whisper' },
    ],
  },
  {
    id: 'commons-dining-hall',
    name: 'Commons Dining Hall',
    category: 'dining',
    capacity: 81,
    density: 'busy',
    noise: 'social',
    hoursLabel: 'Open until 8:00 PM',
    isOpenNow: true,
    rating: 4.2,
    waitTimeMinutes: 12,
    shortDescription: 'The main dining hall with rotating stations and 300+ seats.',
    amenities: ['Vegetarian', 'Halal Options', 'Allergen Friendly', 'Seating 300+'],
    floors: [
      { floor: 'Main Floor', description: 'Grill, deli, and international stations.', noise: 'social' },
      { floor: 'Grille Side', description: 'Quick bites and late-night grill favorites.', noise: 'loud' },
    ],
  },
  {
    id: 'business-building',
    name: 'Business Building',
    category: 'study',
    capacity: 35,
    density: 'quiet',
    noise: 'low-buzz',
    hoursLabel: 'Open until 10:00 PM',
    isOpenNow: true,
    rating: 4.7,
    shortDescription: 'A renovated study building with bright windows, flexible seating, and quiet rooms for focused work.',
    amenities: ['Natural Light', 'Study Rooms', 'Wi-Fi', 'Seating', 'Outlets'],
    floors: [
      { floor: 'First Floor Commons', description: 'Open tables and window seating for individual work.', noise: 'low-buzz' },
      { floor: 'Quiet Study Rooms', description: 'Small rooms suited to focused study and group projects.', noise: 'whisper' },
    ],
  },
  {
    id: 'north-hall',
    name: 'North Hall',
    category: 'study',
    capacity: 20,
    density: 'quiet',
    noise: 'whisper',
    hoursLabel: 'Open until 11:00 PM',
    isOpenNow: true,
    rating: 4.9,
    shortDescription: 'A quiet academic building with open space after classes and window seats for locking in.',
    amenities: ['Quiet Study', 'Window Seating', 'Wi-Fi', 'Individual Desks'],
    floors: [
      { floor: 'Classroom Wing', description: 'Open study areas that become especially quiet after classes end.', noise: 'whisper' },
      { floor: 'Window Study Area', description: 'Individual seats with views of campus and nearby trees.', noise: 'whisper' },
    ],
  },
  {
    id: 'spoelhof-fieldhouse-complex',
    name: 'Spoelhof Fieldhouse Complex',
    category: 'athletics',
    capacity: 48,
    density: 'moderate',
    noise: 'low-buzz',
    hoursLabel: 'Open until 10:00 PM',
    isOpenNow: true,
    rating: 4.3,
    shortDescription: 'A bright athletics complex with an open atrium, lounge seating, and room to reset between classes.',
    amenities: ['Natural Light', 'Lounge Seating', 'Wi-Fi', 'Outlets', 'Walking Space'],
    floors: [
      { floor: 'Main Atrium', description: 'Open seating beneath the glass roof with steady background activity.', noise: 'low-buzz' },
      { floor: 'Upper Walkway', description: 'Quieter overlook seating above the fieldhouse floor.', noise: 'whisper' },
    ],
  },
  {
    id: 'devries-greenhouse-lounge',
    name: 'DeVries Greenhouse Lounge',
    category: 'study',
    capacity: 12,
    density: 'quiet',
    noise: 'whisper',
    hoursLabel: 'Open until 9:00 PM',
    isOpenNow: true,
    rating: 4.8,
    shortDescription: 'A small, peaceful greenhouse lounge with plants, daylight, and a limited number of seats.',
    amenities: ['Natural Light', 'Plants', 'Study Seating', 'Wi-Fi', 'Outlets'],
    floors: [
      { floor: 'Greenhouse Lounge', description: 'Quiet armchairs and small tables surrounded by campus greenery.', noise: 'whisper' },
      { floor: 'Atrium Walkway', description: 'Sunlit walkway seating overlooking the greenhouse.', noise: 'low-buzz' },
    ],
  },
  {
    id: 'cfac-practice-lounges',
    name: 'CFAC Practice Lounges',
    category: 'study',
    capacity: 24,
    density: 'quiet',
    noise: 'low-buzz',
    hoursLabel: 'Open until midnight',
    isOpenNow: true,
    rating: 4.6,
    shortDescription: 'Focused practice lounges with individual nooks, strong outlets, and a warm arts-center atmosphere.',
    amenities: ['Practice Nooks', 'Outlets', 'Wi-Fi', 'Acoustic Spaces', 'Individual Seating'],
    floors: [
      { floor: 'Ground Floor Practice Lounges', description: 'Individual carrels and practice nooks for focused work.', noise: 'low-buzz' },
      { floor: 'Piano Practice Alcove', description: 'Acoustically separated practice spaces with occasional piano sound.', noise: 'social' },
    ],
  },
  {
    id: 'morren-fitness',
    name: 'Morren Fitness Center',
    category: 'athletics',
    capacity: 45,
    density: 'moderate',
    noise: 'loud',
    hoursLabel: 'Open until 11:00 PM',
    isOpenNow: true,
    rating: 4.4,
    shortDescription: 'Cardio, free weights, and group fitness classes for every schedule.',
    amenities: ['Free Weights', 'Cardio Machines', 'Group Classes', 'Locker Rooms'],
    floors: [
      { floor: 'Main Gym', description: 'Cardio machines and open floor space.', noise: 'loud' },
      { floor: 'Weight Room', description: 'Free weights and strength machines.', noise: 'loud' },
      { floor: 'Track (Upper Level)', description: 'Walking and running track above the gym floor.', noise: 'low-buzz' },
    ],
  },
  {
    id: 'peets-coffee',
    name: "Peet's Coffee",
    category: 'dining',
    capacity: 38,
    density: 'quiet',
    noise: 'low-buzz',
    hoursLabel: 'Open until 6:00 PM',
    isOpenNow: true,
    rating: 4.7,
    waitTimeMinutes: 4,
    shortDescription: 'Espresso bar and cozy study seating near the commons.',
    amenities: ['Espresso Bar', 'Mobile Order', 'Study Seating', 'Outlets'],
    floors: [
      { floor: 'Main Floor', description: 'Counter service with lounge and bar seating.', noise: 'low-buzz' },
    ],
  },
];

export const mockRatings: ApiUserRating[] = [
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