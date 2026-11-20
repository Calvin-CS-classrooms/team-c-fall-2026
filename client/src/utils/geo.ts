// Distance maths for finding which campus building the student is in.

import type { Location, Space } from '@/types';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * How close (in metres) the student must be to a building's coordinates to be
 * counted as in it. Phone GPS is usually accurate to 5-20 m outdoors and worse
 * indoors, and the coordinates are each building's centre, so this allows for
 * both. Neighbouring buildings are told apart by picking the closest one.
 */
export const NEAR_BUILDING_METERS = 75;

const EARTH_RADIUS_METERS = 6_371_000;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Straight-line distance in metres between two points (haversine formula). */
export function distanceMeters(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * The building closest to `position`, if one is within `maxMeters`.
 * Buildings without coordinates are skipped.
 */
export function nearestBuilding(
  position: Coordinates,
  locations: Location[],
  maxMeters = NEAR_BUILDING_METERS,
): { location: Location; distance: number } | undefined {
  let best: { location: Location; distance: number } | undefined;
  for (const location of locations) {
    if (location.latitude === undefined || location.longitude === undefined) continue;
    const distance = distanceMeters(position, { latitude: location.latitude, longitude: location.longitude });
    if (distance <= maxMeters && (!best || distance < best.distance)) best = { location, distance };
  }
  return best;
}

/** A space's name without its building's name, e.g. "Hekman Library 3rd Floor" -> "3rd Floor". */
export function floorLabel(space: Pick<Space, 'name'>, location: Pick<Location, 'name'>): string {
  const prefix = `${location.name} `;
  return space.name.startsWith(prefix) ? space.name.slice(prefix.length) : space.name;
}
