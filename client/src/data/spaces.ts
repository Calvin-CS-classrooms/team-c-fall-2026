import type { Space } from '@/types';

export const spaces: Space[] = [
  // Hekman Library (location 1)
  // Listed from the bottom up, which is the order the detail page shows them.
  // Ids 1-4 are kept from the earlier data so seeded ratings, favorites, and
  // amenities still point at the right place (4 is the quiet floor).
  { id: 2, locationId: 1, categoryId: 1, floorId: 2, name: 'Hekman Library Basement', description: 'Study tables and carrels on the lower level, away from foot traffic.', noiseLevel: 'lowBuzz', spotSuggestionId: null, overallRating: 4.4, crowdRating: 35, currentNoiseLevel: 'lowBuzz' },
  { id: 1, locationId: 1, categoryId: 1, floorId: 1, name: 'Hekman Library Student Commons', description: 'Main-level commons with group tables, printers, the service desk, and cafe seating.', noiseLevel: 'social', spotSuggestionId: null, overallRating: 4.6, crowdRating: 50, currentNoiseLevel: 'social' },
  { id: 3, locationId: 1, categoryId: 1, floorId: 3, name: 'Hekman Library 3rd Floor', description: 'Individual study rooms, a fireplace lounge, and an open area for studying with friends.', noiseLevel: 'social', spotSuggestionId: null, overallRating: 4.5, crowdRating: 60, currentNoiseLevel: 'social' },
  { id: 4, locationId: 1, categoryId: 1, floorId: 4, name: 'Hekman Library 4th Floor', description: 'Silent floor: no talking, phones on silent only.', noiseLevel: 'whisper', spotSuggestionId: null, overallRating: 4.8, crowdRating: 30, currentNoiseLevel: 'whisper' },
  { id: 21, locationId: 1, categoryId: 1, floorId: 21, name: 'Hekman Library 5th Floor', description: 'Top-floor tables and window seats for quiet reading.', noiseLevel: 'lowBuzz', spotSuggestionId: null, overallRating: 4.7, crowdRating: 25, currentNoiseLevel: 'lowBuzz' },
  // Commons Dining Hall (location 2)
  { id: 5, locationId: 2, categoryId: 2, floorId: 5, name: 'Commons Main Floor', description: 'Grill, deli, and international stations.', noiseLevel: 'social', spotSuggestionId: null, overallRating: 4.1, crowdRating: 80, currentNoiseLevel: 'loud' },
  { id: 6, locationId: 2, categoryId: 2, floorId: 6, name: 'Commons Grille Side', description: 'Quick bites and late-night grill favorites.', noiseLevel: 'loud', spotSuggestionId: null, overallRating: 4.0, crowdRating: 70, currentNoiseLevel: 'loud' },
  // Business Building (location 3)
  { id: 7, locationId: 3, categoryId: 1, floorId: 7, name: 'Business Commons', description: 'Open tables and window seating for individual work.', noiseLevel: 'lowBuzz', spotSuggestionId: null, overallRating: 4.5, crowdRating: 35, currentNoiseLevel: 'lowBuzz' },
  { id: 8, locationId: 3, categoryId: 1, floorId: 8, name: 'Business Quiet Rooms', description: 'Small rooms suited to focused study and group projects.', noiseLevel: 'whisper', spotSuggestionId: null, overallRating: 4.6, crowdRating: 25, currentNoiseLevel: 'whisper' },
  // North Hall (location 4)
  { id: 9, locationId: 4, categoryId: 1, floorId: 9, name: 'North Classroom Wing', description: 'Open study areas that become especially quiet after classes end.', noiseLevel: 'whisper', spotSuggestionId: null, overallRating: 4.9, crowdRating: 20, currentNoiseLevel: 'whisper' },
  { id: 10, locationId: 4, categoryId: 1, floorId: 10, name: 'North Window Study', description: 'Individual seats with views of campus and nearby trees.', noiseLevel: 'whisper', spotSuggestionId: null, overallRating: 4.8, crowdRating: 15, currentNoiseLevel: 'whisper' },
  // Spoelhof Fieldhouse (location 5)
  { id: 11, locationId: 5, categoryId: 3, floorId: 11, name: 'Spoelhof Main Atrium', description: 'Open seating beneath the glass roof with steady background activity.', noiseLevel: 'lowBuzz', spotSuggestionId: null, overallRating: 4.3, crowdRating: 45, currentNoiseLevel: 'lowBuzz' },
  { id: 12, locationId: 5, categoryId: 3, floorId: 12, name: 'Spoelhof Upper Walkway', description: 'Quieter overlook seating above the fieldhouse floor.', noiseLevel: 'whisper', spotSuggestionId: null, overallRating: 4.4, crowdRating: 30, currentNoiseLevel: 'whisper' },
  // DeVries Greenhouse (location 6)
  { id: 13, locationId: 6, categoryId: 1, floorId: 13, name: 'Greenhouse Lounge', description: 'Quiet armchairs and small tables surrounded by campus greenery.', noiseLevel: 'whisper', spotSuggestionId: null, overallRating: 4.8, crowdRating: 12, currentNoiseLevel: 'whisper' },
  { id: 14, locationId: 6, categoryId: 1, floorId: 14, name: 'Greenhouse Atrium Walkway', description: 'Sunlit walkway seating overlooking the greenhouse.', noiseLevel: 'lowBuzz', spotSuggestionId: null, overallRating: 4.7, crowdRating: 20, currentNoiseLevel: 'lowBuzz' },
  // CFAC Practice Lounges (location 7)
  { id: 15, locationId: 7, categoryId: 1, floorId: 15, name: 'CFAC Practice Lounges', description: 'Individual carrels and practice nooks for focused work.', noiseLevel: 'lowBuzz', spotSuggestionId: null, overallRating: 4.6, crowdRating: 24, currentNoiseLevel: 'lowBuzz' },
  { id: 16, locationId: 7, categoryId: 1, floorId: 16, name: 'CFAC Piano Alcove', description: 'Acoustically separated practice spaces with occasional piano sound.', noiseLevel: 'social', spotSuggestionId: null, overallRating: 4.5, crowdRating: 30, currentNoiseLevel: 'social' },
  // Morren Fitness (location 8)
  { id: 17, locationId: 8, categoryId: 3, floorId: 17, name: 'Morren Main Gym', description: 'Cardio machines and open floor space.', noiseLevel: 'loud', spotSuggestionId: null, overallRating: 4.4, crowdRating: 55, currentNoiseLevel: 'loud' },
  { id: 18, locationId: 8, categoryId: 3, floorId: 18, name: 'Morren Weight Room', description: 'Free weights and strength machines.', noiseLevel: 'loud', spotSuggestionId: null, overallRating: 4.3, crowdRating: 60, currentNoiseLevel: 'loud' },
  { id: 19, locationId: 8, categoryId: 3, floorId: 19, name: 'Morren Track', description: 'Walking and running track above the gym floor.', noiseLevel: 'lowBuzz', spotSuggestionId: null, overallRating: 4.5, crowdRating: 40, currentNoiseLevel: 'lowBuzz' },
  // Peet's Coffee (location 9)
  { id: 20, locationId: 9, categoryId: 2, floorId: 20, name: "Peet's Seating", description: 'Counter service with lounge and bar seating.', noiseLevel: 'lowBuzz', spotSuggestionId: null, overallRating: 4.7, crowdRating: 38, currentNoiseLevel: 'lowBuzz' },
];

export function getSpacesByLocationId(locationId: number): Space[] {
  return spaces.filter((space) => space.locationId === locationId);
}

export function getSpaceById(id: number): Space | undefined {
  return spaces.find((space) => space.id === id);
}
