// Tests the distance maths and picking the building the student is in.
import { locations } from '@/data/locations';
import type { Location, Space } from '@/types';
import { distanceMeters, floorLabel, NEAR_BUILDING_METERS, nearestBuilding } from '@/utils/geo';

// Coordinates from OpenStreetMap.
const HEKMAN = { latitude: 42.9297932, longitude: -85.5875716 };
const COMMONS = { latitude: 42.9311663, longitude: -85.5871575 };

function building(id: number, coords?: { latitude: number; longitude: number }): Location {
  return {
    id,
    name: `Building ${id}`,
    image: undefined,
    description: '',
    numFloors: 1,
    numSpaces: 1,
    hours: { openingTime: '07:00', closingTime: '22:00' },
    ...coords,
  };
}

describe('distanceMeters', () => {
  it('is 0 for the same point', () => {
    expect(distanceMeters(HEKMAN, HEKMAN)).toBe(0);
  });

  it('measures the distance between two campus buildings', () => {
    // Hekman Library to Commons Dining Hall is about 156 m.
    expect(distanceMeters(HEKMAN, COMMONS)).toBeGreaterThan(145);
    expect(distanceMeters(HEKMAN, COMMONS)).toBeLessThan(165);
  });

  it('is the same in both directions', () => {
    expect(distanceMeters(HEKMAN, COMMONS)).toBeCloseTo(distanceMeters(COMMONS, HEKMAN), 6);
  });
});

describe('nearestBuilding', () => {
  const library = building(1, HEKMAN);
  const commons = building(2, COMMONS);

  it('picks the closest building within range', () => {
    // A spot 20 m north of Hekman.
    const position = { latitude: HEKMAN.latitude + 0.00018, longitude: HEKMAN.longitude };

    const result = nearestBuilding(position, [commons, library]);

    expect(result?.location.id).toBe(1);
    expect(result?.distance).toBeLessThan(25);
  });

  it(`returns nothing when no building is within ${NEAR_BUILDING_METERS} m`, () => {
    // About 1 km south of campus.
    const position = { latitude: 42.921, longitude: -85.5875 };

    expect(nearestBuilding(position, [library, commons])).toBeUndefined();
  });

  it('ignores buildings without coordinates', () => {
    expect(nearestBuilding(HEKMAN, [building(3)])).toBeUndefined();
  });

  it('accepts a custom range', () => {
    // 156 m away: outside the default range, inside a 200 m range.
    expect(nearestBuilding(COMMONS, [library])).toBeUndefined();
    expect(nearestBuilding(COMMONS, [library], 200)?.location.id).toBe(1);
  });
});

describe('floorLabel', () => {
  const hekman = building(1);
  hekman.name = 'Hekman Library';
  const space = (name: string) => ({ name }) as Space;

  it("drops the building's name from the space name", () => {
    expect(floorLabel(space('Hekman Library 3rd Floor'), hekman)).toBe('3rd Floor');
    expect(floorLabel(space('Hekman Library Student Commons'), hekman)).toBe('Student Commons');
  });

  it("keeps the full name when it doesn't start with the building's name", () => {
    expect(floorLabel(space('Reading Room'), hekman)).toBe('Reading Room');
  });
});

describe('bundled building coordinates', () => {
  // Rough box around the Calvin University campus.
  const onCampus = (location: Location) =>
    location.latitude! > 42.925 &&
    location.latitude! < 42.937 &&
    location.longitude! > -85.595 &&
    location.longitude! < -85.58;

  it('places every building with coordinates on campus', () => {
    const withCoords = locations.filter((location) => location.latitude !== undefined);

    expect(withCoords.length).toBeGreaterThanOrEqual(7);
    for (const location of withCoords) {
      expect(onCampus(location)).toBe(true);
    }
  });

  it('has Hekman Library at its OpenStreetMap position', () => {
    const hekman = locations.find((location) => location.name === 'Hekman Library');

    expect(hekman).toMatchObject(HEKMAN);
  });
});
