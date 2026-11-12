import { getLocationById, locations } from '@/data/locations';

describe('campus location mock data', () => {
  it('contains all campus locations', () => {
    expect(locations).toHaveLength(9);
    expect(locations.map((location) => location.name)).toEqual([
      'Hekman Library',
      'Commons Dining Hall',
      'Business Building',
      'North Hall',
      'Spoelhof Fieldhouse Complex',
      'DeVries Greenhouse Lounge',
      'CFAC Practice Lounges',
      'Morren Fitness Center',
      "Peet's Coffee",
    ]);
  });

  it('includes usable floor, space, hours, and image data', () => {
    for (const location of locations) {
      expect(location.numFloors).toBeGreaterThanOrEqual(1);
      expect(location.numSpaces).toBeGreaterThanOrEqual(0);
      expect(location.hours.openingTime).toBeDefined();
      expect(location.hours.closingTime).toBeDefined();
      expect(location.image).toBeDefined();
    }
  });

  it('finds a location by id and returns undefined for an unknown id', () => {
    expect(getLocationById(1)?.name).toBe('Hekman Library');
    expect(getLocationById(999)).toBeUndefined();
  });

  it('has unique ids and valid hours', () => {
    const ids = locations.map((location) => location.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const location of locations) {
      expect(location.hours.openingTime).toMatch(/^\d{2}:\d{2}$/);
      expect(location.hours.closingTime).toMatch(/^\d{2}:\d{2}$/);
    }
  });
});
