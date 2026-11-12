import {
  getAmenitiesBySpaceId,
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
