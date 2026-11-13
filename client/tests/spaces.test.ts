import { getSpaceById, getSpacesByLocationId, spaces } from '@/data/spaces';
import { categories } from '@/data/categories';
import { floors } from '@/data/floors';
import { locations } from '@/data/locations';
import type { NoiseLevel } from '@/types';

const NOISE_LEVELS: NoiseLevel[] = ['whisper', 'lowBuzz', 'social', 'loud'];

describe('spaces mock data', () => {
  it('has unique ids and unique floor ids', () => {
    const ids = spaces.map((space) => space.id);
    const floorIds = spaces.map((space) => space.floorId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(floorIds).size).toBe(floorIds.length);
  });

  it('references only existing locations, categories, and floors', () => {
    const locationIds = new Set(locations.map((location) => location.id));
    const categoryIds = new Set(categories.map((category) => category.id));
    const floorIds = new Set(floors.map((floor) => floor.id));

    for (const space of spaces) {
      expect(locationIds.has(space.locationId)).toBe(true);
      expect(categoryIds.has(space.categoryId)).toBe(true);
      expect(floorIds.has(space.floorId)).toBe(true);
    }
  });

  it('uses only valid noise levels and in-range ratings', () => {
    for (const space of spaces) {
      expect(NOISE_LEVELS).toContain(space.noiseLevel);
      expect(NOISE_LEVELS).toContain(space.currentNoiseLevel);
      expect(space.overallRating).toBeGreaterThanOrEqual(0);
      expect(space.overallRating).toBeLessThanOrEqual(5);
      expect(space.crowdRating).toBeGreaterThanOrEqual(0);
      expect(space.crowdRating).toBeLessThanOrEqual(100);
      expect(space.name.length).toBeGreaterThan(0);
    }
  });

  it('has at least one space per location', () => {
    for (const location of locations) {
      expect(getSpacesByLocationId(location.id).length).toBeGreaterThan(0);
    }
  });
});

describe('getSpacesByLocationId', () => {
  it('returns only spaces at the given location', () => {
    const hekman = getSpacesByLocationId(1);
    expect(hekman.length).toBeGreaterThan(0);
    for (const space of hekman) {
      expect(space.locationId).toBe(1);
    }
  });

  it('lists Hekman Library from the basement up', () => {
    expect(getSpacesByLocationId(1).map((space) => space.name)).toEqual([
      'Hekman Library Basement',
      'Hekman Library Student Commons',
      'Hekman Library 3rd Floor',
      'Hekman Library 4th Floor',
      'Hekman Library 5th Floor',
    ]);
  });

  it('returns an empty array for an unknown location', () => {
    expect(getSpacesByLocationId(999)).toEqual([]);
  });
});

describe('getSpaceById', () => {
  it('finds a space by id', () => {
    // Space 4 stays the quiet floor that seeded ratings and favorites refer to.
    expect(getSpaceById(4)).toMatchObject({ name: 'Hekman Library 4th Floor', noiseLevel: 'whisper' });
  });

  it('returns undefined for an unknown id', () => {
    expect(getSpaceById(999)).toBeUndefined();
  });
});
