import { categories, getCategoryById } from '@/data/categories';
import { floors, getFloorById, getFloorsByLocationId } from '@/data/floors';
import { amenities, getAmenityById } from '@/data/amenities';
import { locations } from '@/data/locations';
import type { NoiseLevel } from '@/types';

const NOISE_LEVELS: NoiseLevel[] = ['whisper', 'lowBuzz', 'social', 'loud'];

describe('categories mock data', () => {
  it('has unique ids and non-empty names', () => {
    const ids = categories.map((category) => category.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const category of categories) {
      expect(category.name.length).toBeGreaterThan(0);
    }
  });

  it('finds a category by id and returns undefined for an unknown id', () => {
    expect(getCategoryById(1)?.name).toBe('study');
    expect(getCategoryById(999)).toBeUndefined();
  });
});

describe('floors mock data', () => {
  it('has unique ids and references only existing locations', () => {
    const ids = floors.map((floor) => floor.id);
    const locationIds = new Set(locations.map((location) => location.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const floor of floors) {
      expect(locationIds.has(floor.locationId)).toBe(true);
      expect(NOISE_LEVELS).toContain(floor.noiseLevel);
    }
  });

  it('has at least one floor per location', () => {
    for (const location of locations) {
      expect(getFloorsByLocationId(location.id).length).toBeGreaterThan(0);
    }
  });

  it('filters floors by location and returns an empty array for an unknown location', () => {
    const hekman = getFloorsByLocationId(1);
    expect(hekman.length).toBeGreaterThan(0);
    for (const floor of hekman) {
      expect(floor.locationId).toBe(1);
    }
    expect(getFloorsByLocationId(999)).toEqual([]);
  });

  it('finds a floor by id and returns undefined for an unknown id', () => {
    expect(getFloorById(4)).toMatchObject({ name: '4th Floor', noiseLevel: 'whisper' });
    expect(getFloorById(999)).toBeUndefined();
  });
});

describe('amenities mock data', () => {
  it('has unique ids and non-empty names', () => {
    const ids = amenities.map((amenity) => amenity.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const amenity of amenities) {
      expect(amenity.name.length).toBeGreaterThan(0);
    }
  });

  it('finds an amenity by id and returns undefined for an unknown id', () => {
    expect(getAmenityById(1)?.name).toBe('Wi-Fi');
    expect(getAmenityById(999)).toBeUndefined();
  });
});
