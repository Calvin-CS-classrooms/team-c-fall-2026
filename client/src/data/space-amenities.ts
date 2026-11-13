import { getAmenityById } from '@/data/amenities';
import type { SpaceAmenity } from '@/types';

// Mock space-amenity join data (mirrors the spaceAmenities table).
// Maps each space to the amenities it offers, using ids from amenities.ts.
// Wi-Fi and outlets are campus-wide, so they are not listed per space.

export const spaceAmenities: SpaceAmenity[] = [
  // Hekman Library, bottom to top
  // Basement (space 2)
  { spaceId: 2, amenityId: 31 }, // Individual Desks with Monitors
  { spaceId: 2, amenityId: 32 }, // Gaming PCs
  { spaceId: 2, amenityId: 33 }, // Gaming Room
  { spaceId: 2, amenityId: 34 }, // CIT Department
  { spaceId: 2, amenityId: 8 }, // Printer
  { spaceId: 2, amenityId: 35 }, // Group Tables
  // Student Commons (space 1)
  { spaceId: 1, amenityId: 5 }, // Group Friendly
  { spaceId: 1, amenityId: 36 }, // Vending Machines
  { spaceId: 1, amenityId: 37 }, // Peet's Coffee
  { spaceId: 1, amenityId: 38 }, // CIT Help Desk
  { spaceId: 1, amenityId: 8 }, // Printer
  { spaceId: 1, amenityId: 35 }, // Group Tables
  { spaceId: 1, amenityId: 39 }, // Whiteboards
  { spaceId: 1, amenityId: 40 }, // Student Success
  { spaceId: 1, amenityId: 41 }, // Intercultural Student Office (CISD)
  { spaceId: 1, amenityId: 42 }, // Service-Learning Office
  { spaceId: 1, amenityId: 43 }, // Sexuality Series Office
  { spaceId: 1, amenityId: 44 }, // Tutoring Room
  { spaceId: 1, amenityId: 45 }, // Student Engagement Office
  { spaceId: 1, amenityId: 46 }, // Commons Square
  { spaceId: 1, amenityId: 47 }, // Honors Office
  // 3rd Floor (space 3)
  { spaceId: 3, amenityId: 28 }, // Reservable Individual Study Rooms
  { spaceId: 3, amenityId: 29 }, // Fireplace
  { spaceId: 3, amenityId: 30 }, // Open Social Area
  { spaceId: 3, amenityId: 48 }, // Rhetoric Center
  { spaceId: 3, amenityId: 49 }, // Library Help Desk
  { spaceId: 3, amenityId: 8 }, // Printer
  { spaceId: 3, amenityId: 5 }, // Group Friendly
  { spaceId: 3, amenityId: 50 }, // Career Center
  { spaceId: 3, amenityId: 51 }, // Campus Ministries
  { spaceId: 3, amenityId: 35 }, // Group Tables
  // 4th Floor (space 4)
  { spaceId: 4, amenityId: 52 }, // PhD Seminary Office
  { spaceId: 4, amenityId: 53 }, // H. Henry Meeter Center
  { spaceId: 4, amenityId: 54 }, // Seminary Carrels
  { spaceId: 4, amenityId: 35 }, // Group Tables
  { spaceId: 4, amenityId: 55 }, // Study Carrels
  { spaceId: 4, amenityId: 39 }, // Whiteboards
  // 5th Floor (space 21)
  { spaceId: 21, amenityId: 35 }, // Group Tables
  { spaceId: 21, amenityId: 55 }, // Study Carrels
  { spaceId: 21, amenityId: 39 }, // Whiteboards
  // Commons Dining Hall (spaces 5-6)
  { spaceId: 5, amenityId: 3 }, // Seating
  { spaceId: 5, amenityId: 7 }, // Food Nearby
  { spaceId: 6, amenityId: 3 }, // Seating
  { spaceId: 6, amenityId: 7 }, // Food Nearby
  // Business Building (spaces 7-8)
  { spaceId: 7, amenityId: 3 }, // Seating
  { spaceId: 7, amenityId: 6 }, // Natural Light
  { spaceId: 7, amenityId: 20 }, // Window Seating
  { spaceId: 8, amenityId: 4 }, // Quiet
  { spaceId: 8, amenityId: 19 }, // Study Rooms
  // North Hall (spaces 9-10)
  { spaceId: 9, amenityId: 4 }, // Quiet
  { spaceId: 10, amenityId: 6 }, // Natural Light
  { spaceId: 10, amenityId: 20 }, // Window Seating
  // Spoelhof Fieldhouse (spaces 11-12)
  { spaceId: 11, amenityId: 3 }, // Seating
  { spaceId: 11, amenityId: 6 }, // Natural Light
  { spaceId: 12, amenityId: 3 }, // Seating
  // DeVries Greenhouse (spaces 13-14)
  { spaceId: 13, amenityId: 3 }, // Seating
  { spaceId: 13, amenityId: 24 }, // Plants
  { spaceId: 14, amenityId: 3 }, // Seating
  { spaceId: 14, amenityId: 6 }, // Natural Light
  { spaceId: 14, amenityId: 24 }, // Plants
  // CFAC Practice Lounges (spaces 15-16)
  { spaceId: 15, amenityId: 25 }, // Practice Nooks
  { spaceId: 16, amenityId: 26 }, // Acoustic Spaces
  // Morren Fitness (spaces 17-19)
  { spaceId: 17, amenityId: 13 }, // Free Weights
  { spaceId: 17, amenityId: 14 }, // Cardio Machines
  { spaceId: 17, amenityId: 16 }, // Locker Rooms
  { spaceId: 18, amenityId: 13 }, // Free Weights
  { spaceId: 18, amenityId: 14 }, // Cardio Machines
  { spaceId: 18, amenityId: 16 }, // Locker Rooms
  { spaceId: 19, amenityId: 23 }, // Walking Space
  // Peet's Coffee (space 20)
  { spaceId: 20, amenityId: 3 }, // Seating
  { spaceId: 20, amenityId: 17 }, // Espresso Bar
  { spaceId: 20, amenityId: 18 }, // Mobile Order
];

export function getAmenitiesBySpaceId(spaceId: number): SpaceAmenity[] {
  return spaceAmenities.filter((entry) => entry.spaceId === spaceId);
}

export function getSpaceIdsByAmenityId(amenityId: number): SpaceAmenity[] {
  return spaceAmenities.filter((entry) => entry.amenityId === amenityId);
}

/** Names of the amenities a space offers, in data order (e.g. ['Fireplace', 'Whiteboards']). */
export function getAmenityNamesBySpaceId(spaceId: number): string[] {
  return getAmenitiesBySpaceId(spaceId)
    .map((entry) => getAmenityById(entry.amenityId)?.name)
    .filter((name): name is string => Boolean(name));
}
