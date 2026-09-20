import { getLocationById, locations } from '@/data/locations';

const getAssetValue = (asset: unknown) => asset;

describe('campus location mock data', () => {
  it('contains the four required campus locations', () => {
    expect(locations).toHaveLength(4);
    expect(locations.map((location) => location.name)).toEqual([
      'Hekman Library',
      'Commons Dining Hall',
      'Morren Fitness Center',
      "Peet's Coffee",
    ]);
  });

  it('includes usable capacity, category, amenities, and floor data', () => {
    for (const location of locations) {
      expect(location.capacity).toBeGreaterThanOrEqual(0);
      expect(location.capacity).toBeLessThanOrEqual(100);
      expect(location.amenities.length).toBeGreaterThan(0);
      expect(location.floors.length).toBeGreaterThan(0);
      expect(getAssetValue(location.image)).toBeDefined();
    }
  });

  it('finds a location by id and returns undefined for an unknown id', () => {
    expect(getLocationById('hekman-library')?.name).toBe('Hekman Library');
    expect(getLocationById('missing-location')).toBeUndefined();
  });
});
