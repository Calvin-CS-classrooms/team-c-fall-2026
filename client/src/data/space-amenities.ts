import type { SpaceAmenity } from '@/types';

// Mock space-amenity join data (mirrors the spaceAmenities table).
// Maps each space to the amenities it offers, using ids from amenities.ts.

export const spaceAmenities: SpaceAmenity[] = [
  // Hekman Library (spaces 1-4)
  { spaceId: 1, amenityId: 1 }, // Wi-Fi
  { spaceId: 1, amenityId: 2 }, // Outlets
  { spaceId: 1, amenityId: 3 }, // Seating
  { spaceId: 1, amenityId: 7 }, // Food Nearby
  { spaceId: 2, amenityId: 1 }, // Wi-Fi
  { spaceId: 2, amenityId: 2 }, // Outlets
  { spaceId: 2, amenityId: 3 }, // Seating
  { spaceId: 2, amenityId: 6 }, // Natural Light
  { spaceId: 3, amenityId: 1 }, // Wi-Fi
  { spaceId: 3, amenityId: 2 }, // Outlets
  { spaceId: 3, amenityId: 5 }, // Group Friendly
  { spaceId: 3, amenityId: 19 }, // Study Rooms
  { spaceId: 4, amenityId: 1 }, // Wi-Fi
  { spaceId: 4, amenityId: 2 }, // Outlets
  { spaceId: 4, amenityId: 4 }, // Quiet
  { spaceId: 4, amenityId: 9 }, // Silent Floor
  // Commons Dining Hall (spaces 5-6)
  { spaceId: 5, amenityId: 1 }, // Wi-Fi
  { spaceId: 5, amenityId: 3 }, // Seating
  { spaceId: 5, amenityId: 7 }, // Food Nearby
  { spaceId: 6, amenityId: 3 }, // Seating
  { spaceId: 6, amenityId: 7 }, // Food Nearby
  // Business Building (spaces 7-8)
  { spaceId: 7, amenityId: 1 }, // Wi-Fi
  { spaceId: 7, amenityId: 2 }, // Outlets
  { spaceId: 7, amenityId: 3 }, // Seating
  { spaceId: 7, amenityId: 6 }, // Natural Light
  { spaceId: 7, amenityId: 20 }, // Window Seating
  { spaceId: 8, amenityId: 1 }, // Wi-Fi
  { spaceId: 8, amenityId: 2 }, // Outlets
  { spaceId: 8, amenityId: 4 }, // Quiet
  { spaceId: 8, amenityId: 19 }, // Study Rooms
  // North Hall (spaces 9-10)
  { spaceId: 9, amenityId: 1 }, // Wi-Fi
  { spaceId: 9, amenityId: 2 }, // Outlets
  { spaceId: 9, amenityId: 4 }, // Quiet
  { spaceId: 10, amenityId: 1 }, // Wi-Fi
  { spaceId: 10, amenityId: 2 }, // Outlets
  { spaceId: 10, amenityId: 6 }, // Natural Light
  { spaceId: 10, amenityId: 20 }, // Window Seating
  // Spoelhof Fieldhouse (spaces 11-12)
  { spaceId: 11, amenityId: 1 }, // Wi-Fi
  { spaceId: 11, amenityId: 3 }, // Seating
  { spaceId: 11, amenityId: 6 }, // Natural Light
  { spaceId: 12, amenityId: 1 }, // Wi-Fi
  { spaceId: 12, amenityId: 3 }, // Seating
  // DeVries Greenhouse (spaces 13-14)
  { spaceId: 13, amenityId: 1 }, // Wi-Fi
  { spaceId: 13, amenityId: 3 }, // Seating
  { spaceId: 13, amenityId: 24 }, // Plants
  { spaceId: 14, amenityId: 1 }, // Wi-Fi
  { spaceId: 14, amenityId: 3 }, // Seating
  { spaceId: 14, amenityId: 6 }, // Natural Light
  { spaceId: 14, amenityId: 24 }, // Plants
  // CFAC Practice Lounges (spaces 15-16)
  { spaceId: 15, amenityId: 1 }, // Wi-Fi
  { spaceId: 15, amenityId: 2 }, // Outlets
  { spaceId: 15, amenityId: 25 }, // Practice Nooks
  { spaceId: 16, amenityId: 1 }, // Wi-Fi
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
  { spaceId: 20, amenityId: 1 }, // Wi-Fi
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
