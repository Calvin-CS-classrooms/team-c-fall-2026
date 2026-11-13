// Groups spaces into buildings (locations) for building-level cards, such as
// the home screen carousel and the Explore directory.

import type { Location, Space } from '@/types';

/** The rating and crowd level shown on a building's card. */
export interface BuildingStats {
  overallRating: number;
  crowdRating: number;
}

/** A building together with the spaces inside it and its card stats. */
export interface BuildingGroup extends BuildingStats {
  location: Location;
  spaces: Space[];
}

/**
 * Combines a building's spaces into one rating and crowd level.
 *
 * Only spaces that have ratings count (overallRating > 0). An unrated space
 * reports 0 stars and 0% busy, which would otherwise make a popular building
 * look empty and badly rated.
 */
export function summarizeBuilding(spaces: Space[]): BuildingStats {
  const rated = spaces.filter((space) => space.overallRating > 0);
  if (rated.length === 0) {
    return { overallRating: 0, crowdRating: 0 };
  }

  const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  return {
    overallRating: Math.round(average(rated.map((space) => space.overallRating)) * 10) / 10,
    crowdRating: Math.round(average(rated.map((space) => space.crowdRating))),
  };
}

/**
 * Groups spaces by building, one entry per building.
 *
 * Buildings appear in the order their first space appears in `spaces`, so a
 * list already sorted (e.g. by the Trending filter) keeps its order. Spaces
 * whose building cannot be found are left out.
 *
 * @param spaces - The spaces to group, typically after filters are applied.
 * @param findLocation - Looks up a building by id (e.g. getLocationById).
 */
export function groupSpacesByBuilding(
  spaces: Space[],
  findLocation: (id: number) => Location | undefined,
): BuildingGroup[] {
  const spacesByBuilding = new Map<number, Space[]>();
  for (const space of spaces) {
    const list = spacesByBuilding.get(space.locationId) ?? [];
    list.push(space);
    spacesByBuilding.set(space.locationId, list);
  }

  const groups: BuildingGroup[] = [];
  for (const [locationId, buildingSpaces] of spacesByBuilding) {
    const location = findLocation(locationId);
    if (!location) continue;
    groups.push({ location, spaces: buildingSpaces, ...summarizeBuilding(buildingSpaces) });
  }
  return groups;
}
