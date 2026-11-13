import {
  getAmenitiesBySpaceId,
  getAmenityNamesBySpaceId,
  getSpaceIdsByAmenityId,
  spaceAmenities,
} from '@/data/space-amenities';
import { amenities } from '@/data/amenities';
import { spaces } from '@/data/spaces';

describe('spaceAmenities mock data', () => {
  it('has unique (spaceId, amenityId) pairs', () => {
    const keys = spaceAmenities.map((entry) => `${entry.spaceId}-${entry.amenityId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('references only existing spaces and amenities', () => {
    const spaceIds = new Set(spaces.map((space) => space.id));
    const amenityIds = new Set(amenities.map((amenity) => amenity.id));

    for (const entry of spaceAmenities) {
      expect(spaceIds.has(entry.spaceId)).toBe(true);
      expect(amenityIds.has(entry.amenityId)).toBe(true);
    }
  });

  it('has at least one amenity per space', () => {
    for (const space of spaces) {
      expect(getAmenitiesBySpaceId(space.id).length).toBeGreaterThan(0);
    }
  });
});

describe('getAmenitiesBySpaceId', () => {
  it('returns only entries for the given space', () => {
    const hekmanCommons = getAmenitiesBySpaceId(1);
    expect(hekmanCommons.length).toBeGreaterThan(0);
    for (const entry of hekmanCommons) {
      expect(entry.spaceId).toBe(1);
    }
  });

  it('returns an empty array for an unknown space', () => {
    expect(getAmenitiesBySpaceId(999)).toEqual([]);
  });
});

describe('getSpaceIdsByAmenityId', () => {
  it('returns only entries for the given amenity', () => {
    const wifi = getSpaceIdsByAmenityId(1);
    expect(wifi.length).toBeGreaterThan(0);
    for (const entry of wifi) {
      expect(entry.amenityId).toBe(1);
    }
  });

  it('returns an empty array for an unknown amenity', () => {
    expect(getSpaceIdsByAmenityId(999)).toEqual([]);
  });
});

describe('getAmenityNamesBySpaceId', () => {
  it("returns the names of a space's amenities in data order", () => {
    expect(getAmenityNamesBySpaceId(20)).toEqual(['Wi-Fi', 'Seating', 'Espresso Bar', 'Mobile Order']);
  });

  it('returns an empty list for an unknown space', () => {
    expect(getAmenityNamesBySpaceId(999)).toEqual([]);
  });
});

describe('Hekman Library amenities', () => {
  it('describes the 3rd floor: individual study rooms, a fireplace, and an open social area', () => {
    expect(getAmenityNamesBySpaceId(3)).toEqual(
      expect.arrayContaining(['Individual Study Rooms', 'Fireplace', 'Open Social Area']),
    );
  });

  it('gives every Hekman level at least three amenities', () => {
    for (const space of spaces.filter((s) => s.locationId === 1)) {
      expect(getAmenityNamesBySpaceId(space.id).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps the 4th floor marked as the silent floor', () => {
    expect(getAmenityNamesBySpaceId(4)).toEqual(expect.arrayContaining(['Silent Floor', 'Quiet']));
  });
});
