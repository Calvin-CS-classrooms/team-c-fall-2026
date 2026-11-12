import type { Floor } from '@/types';

export const floors: Floor[] = [
  { id: 1, locationId: 1, name: 'Floor 1 — Commons', noiseLevel: 'social' },
  { id: 2, locationId: 1, name: 'Floor 2 — Reading Room', noiseLevel: 'lowBuzz' },
  { id: 3, locationId: 1, name: 'Floor 3 — Group Study', noiseLevel: 'social' },
  { id: 4, locationId: 1, name: 'Floor 4 — Silent Floor', noiseLevel: 'whisper' },
  { id: 5, locationId: 2, name: 'Main Floor', noiseLevel: 'social' },
  { id: 6, locationId: 2, name: 'Grille Side', noiseLevel: 'loud' },
  { id: 7, locationId: 3, name: 'First Floor Commons', noiseLevel: 'lowBuzz' },
  { id: 8, locationId: 3, name: 'Quiet Study Rooms', noiseLevel: 'whisper' },
  { id: 9, locationId: 4, name: 'Classroom Wing', noiseLevel: 'whisper' },
  { id: 10, locationId: 4, name: 'Window Study Area', noiseLevel: 'whisper' },
  { id: 11, locationId: 5, name: 'Main Atrium', noiseLevel: 'lowBuzz' },
  { id: 12, locationId: 5, name: 'Upper Walkway', noiseLevel: 'whisper' },
  { id: 13, locationId: 6, name: 'Greenhouse Lounge', noiseLevel: 'whisper' },
  { id: 14, locationId: 6, name: 'Atrium Walkway', noiseLevel: 'lowBuzz' },
  { id: 15, locationId: 7, name: 'Ground Floor Practice Lounges', noiseLevel: 'lowBuzz' },
  { id: 16, locationId: 7, name: 'Piano Practice Alcove', noiseLevel: 'social' },
  { id: 17, locationId: 8, name: 'Main Gym', noiseLevel: 'loud' },
  { id: 18, locationId: 8, name: 'Weight Room', noiseLevel: 'loud' },
  { id: 19, locationId: 8, name: 'Track (Upper Level)', noiseLevel: 'lowBuzz' },
  { id: 20, locationId: 9, name: 'Main Floor', noiseLevel: 'lowBuzz' },
];

export function getFloorsByLocationId(locationId: number): Floor[] {
  return floors.filter((floor) => floor.locationId === locationId);
}

export function getFloorById(id: number): Floor | undefined {
  return floors.find((floor) => floor.id === id);
}
