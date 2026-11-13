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
    const groupTables = getSpaceIdsByAmenityId(35);
    expect(groupTables.length).toBeGreaterThan(0);
    for (const entry of groupTables) {
      expect(entry.amenityId).toBe(35);
    }
  });

  it('returns an empty array for an unknown amenity', () => {
    expect(getSpaceIdsByAmenityId(999)).toEqual([]);
  });
});

describe('getAmenityNamesBySpaceId', () => {
  it("returns the names of a space's amenities in data order", () => {
    expect(getAmenityNamesBySpaceId(20)).toEqual(['Seating', 'Espresso Bar', 'Mobile Order']);
  });

  it('returns an empty list for an unknown space', () => {
    expect(getAmenityNamesBySpaceId(999)).toEqual([]);
  });
});

describe('campus-wide amenities', () => {
  // Every building has Wi-Fi and outlets, so listing them on each space adds noise.
  it('does not list Wi-Fi or outlets as amenities', () => {
    const names = amenities.map((amenity) => amenity.name);

    expect(names).not.toContain('Wi-Fi');
    expect(names).not.toContain('Outlets');
  });

  it('does not attach Wi-Fi or outlets to any space', () => {
    for (const space of spaces) {
      expect(getAmenityNamesBySpaceId(space.id)).not.toEqual(expect.arrayContaining(['Wi-Fi']));
      expect(getAmenityNamesBySpaceId(space.id)).not.toEqual(expect.arrayContaining(['Outlets']));
    }
  });
});

describe('Hekman Library amenities', () => {
  it.each([
    [
      'Basement',
      2,
      ['Individual Desks with Monitors', 'Gaming PCs', 'Gaming Room', 'CIT Department', 'Printer', 'Group Tables'],
    ],
    [
      'Student Commons',
      1,
      [
        'Group Friendly',
        'Vending Machines',
        "Peet's Coffee",
        'CIT Help Desk',
        'Printer',
        'Group Tables',
        'Whiteboards',
        'Student Success',
        'Intercultural Student Office (CISD)',
        'Service-Learning Office',
        'Sexuality Series Office',
        'Tutoring Room',
        'Student Engagement Office',
        'Commons Square',
        'Honors Office',
      ],
    ],
    [
      '3rd Floor',
      3,
      [
        'Reservable Individual Study Rooms',
        'Fireplace',
        'Open Social Area',
        'Rhetoric Center',
        'Library Help Desk',
        'Printer',
        'Group Friendly',
        'Career Center',
        'Campus Ministries',
        'Group Tables',
      ],
    ],
    [
      '4th Floor',
      4,
      ['PhD Seminary Office', 'H. Henry Meeter Center', 'Seminary Carrels', 'Group Tables', 'Study Carrels', 'Whiteboards'],
    ],
    ['5th Floor', 21, ['Group Tables', 'Study Carrels', 'Whiteboards']],
  ])('lists what the %s has', (_level, spaceId, expected) => {
    expect(getAmenityNamesBySpaceId(spaceId)).toEqual(expected);
  });
});
