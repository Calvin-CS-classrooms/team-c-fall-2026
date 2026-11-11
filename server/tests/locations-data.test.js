// Validates the mock location data the API serves, so a typo in data/locations.js
// is caught here instead of crashing or mis-rendering the client.

const locations = require("../data/locations");

// These must match the client types in client/src/types/index.ts.
const CATEGORIES = ["study", "dining", "athletics", "events"];
const DENSITY_LEVELS = ["quiet", "moderate", "busy"];
const NOISE_LEVELS = ["whisper", "low-buzz", "social", "loud"];

// The client can only show images it has bundled. Keep this list in sync with the
// `images` map in client/src/services/locations-api.ts.
const CLIENT_IMAGE_KEYS = [
  "hekman_library",
  "dining-hall-min",
  "business-building",
  "north-hall",
  "spoelhof-fieldhouse",
  "devries-greenhouse",
  "cfac-practice-lounges",
  "morren-fitness",
  "peets-coffee"
];

describe("Location mock data", () => {

  test("is a non-empty array", () => {
    expect(Array.isArray(locations)).toBe(true);
    expect(locations.length).toBeGreaterThan(0);
  });

  test("every location has a unique id", () => {
    const ids = locations.map(loc => loc.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("ids are URL-safe kebab-case slugs", () => {
    for (const loc of locations) {
      expect(loc.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  test.each(locations.map(loc => [loc.id, loc]))(
    "%s has all required fields with the right types",
    (_id, loc) => {
      expect(typeof loc.name).toBe("string");
      expect(loc.name.length).toBeGreaterThan(0);
      expect(typeof loc.imageKey).toBe("string");
      expect(typeof loc.hoursLabel).toBe("string");
      expect(typeof loc.isOpenNow).toBe("boolean");
      expect(typeof loc.shortDescription).toBe("string");
      expect(Array.isArray(loc.amenities)).toBe(true);
      expect(Array.isArray(loc.floors)).toBe(true);
    }
  );

  test.each(locations.map(loc => [loc.id, loc]))(
    "%s uses only values the client understands",
    (_id, loc) => {
      expect(CATEGORIES).toContain(loc.category);
      expect(DENSITY_LEVELS).toContain(loc.density);
      expect(NOISE_LEVELS).toContain(loc.noise);
      expect(CLIENT_IMAGE_KEYS).toContain(loc.imageKey);
    }
  );

  test("capacity is a percentage between 0 and 100", () => {
    for (const loc of locations) {
      expect(Number.isInteger(loc.capacity)).toBe(true);
      expect(loc.capacity).toBeGreaterThanOrEqual(0);
      expect(loc.capacity).toBeLessThanOrEqual(100);
    }
  });

  test("rating is between 0 and 5", () => {
    for (const loc of locations) {
      expect(typeof loc.rating).toBe("number");
      expect(loc.rating).toBeGreaterThanOrEqual(0);
      expect(loc.rating).toBeLessThanOrEqual(5);
    }
  });

  test("wait time, when present, is a non-negative number of minutes", () => {
    for (const loc of locations.filter(l => l.waitTimeMinutes !== undefined)) {
      expect(Number.isInteger(loc.waitTimeMinutes)).toBe(true);
      expect(loc.waitTimeMinutes).toBeGreaterThanOrEqual(0);
    }
  });

  test("amenities are non-empty strings without duplicates", () => {
    for (const loc of locations) {
      for (const amenity of loc.amenities) {
        expect(typeof amenity).toBe("string");
        expect(amenity.trim().length).toBeGreaterThan(0);
      }
      expect(new Set(loc.amenities).size).toBe(loc.amenities.length);
    }
  });

  test("every location has at least one floor with a valid noise level", () => {
    for (const loc of locations) {
      expect(loc.floors.length).toBeGreaterThan(0);
      for (const floor of loc.floors) {
        expect(typeof floor.floor).toBe("string");
        expect(typeof floor.description).toBe("string");
        expect(NOISE_LEVELS).toContain(floor.noise);
      }
    }
  });

});
