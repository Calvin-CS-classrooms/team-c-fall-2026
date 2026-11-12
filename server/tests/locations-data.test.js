// Validates the mock location data the API serves, so a typo in data-mock/locations.js
// is caught here instead of crashing or mis-rendering the client.

const locations = require("../data-mock/locations");

// These must match the client types in client/src/types/index.ts.
const NOISE_LEVELS = ["whisper", "lowBuzz", "social", "loud"];

describe("Location mock data", () => {

  test("is a non-empty array", () => {
    expect(Array.isArray(locations)).toBe(true);
    expect(locations.length).toBeGreaterThan(0);
  });

  test("every location has a unique numeric id", () => {
    const ids = locations.map(loc => loc.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(Number.isInteger(id)).toBe(true);
    }
  });

  test.each(locations.map(loc => [loc.id, loc]))(
    "%s has all required fields with the right types",
    (_id, loc) => {
      expect(typeof loc.name).toBe("string");
      expect(loc.name.length).toBeGreaterThan(0);
      expect(typeof loc.image).toBe("string");
      expect(typeof loc.description).toBe("string");
      expect(Number.isInteger(loc.numFloors)).toBe(true);
      expect(loc.numFloors).toBeGreaterThanOrEqual(1);
      expect(Number.isInteger(loc.numSpaces)).toBe(true);
      expect(loc.numSpaces).toBeGreaterThanOrEqual(0);
      expect(typeof loc.hours).toBe("object");
      expect(typeof loc.hours.openingTime).toBe("string");
      expect(typeof loc.hours.closingTime).toBe("string");
    }
  );

  test("hours use HH:MM format", () => {
    for (const loc of locations) {
      expect(loc.hours.openingTime).toMatch(/^\d{2}:\d{2}$/);
      expect(loc.hours.closingTime).toMatch(/^\d{2}:\d{2}$/);
    }
  });

});

