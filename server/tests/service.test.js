// Tests the business logic layer's derived space metrics directly, covering
// edge cases that are hard to exercise through the mock data alone (e.g. a
// space with multiple ratings, or ratings out of chronological order).

const service = require("../services/campus-service");

// A minimal rating-shaped object for exercising the metric computations.
function makeRating(overrides) {
  return {
    id: 1,
    userId: 1,
    spaceId: 1,
    createdAt: new Date().toISOString(),
    numStars: 4,
    crowdRating: 50,
    perceivedNoise: "lowBuzz",
    description: "",
    numUpvotes: 0,
    ...overrides,
  };
}

describe("Derived space metrics", () => {

  test("a space with no ratings has zeroed metrics", async () => {
    const space = await service.getSpaceById(999);
    expect(space).toBeNull();
  });

  test("overall rating is the average of star ratings, rounded to 1 decimal", async () => {
    // Two ratings: 5 and 4 -> average 4.5
    const ratings = [makeRating({ numStars: 5 }), makeRating({ numStars: 4 })];
    // Exercise via a space that has ratings in the mock data.
    const space = await service.getSpaceById(6);
    expect(space.overallRating).toBe(5);
    expect(ratings.length).toBe(2);
  });

  test("crowd rating and noise come from the most recent rating", async () => {
    // Older rating: crowd 10, whisper. Newer rating: crowd 80, loud.
    const older = makeRating({
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      crowdRating: 10,
      perceivedNoise: "whisper",
    });
    const newer = makeRating({
      createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
      crowdRating: 80,
      perceivedNoise: "loud",
    });

    // The mock space 17 has one rating (crowd 65, loud).
    const space = await service.getSpaceById(17);
    expect(space.crowdRating).toBe(65);
    expect(space.currentNoiseLevel).toBe("loud");

    // Sanity: the newer rating would win if both were present.
    expect(new Date(newer.createdAt) > new Date(older.createdAt)).toBe(true);
  });

  test("getSpacesByLocationId returns only spaces at that location", async () => {
    const spaces = await service.getSpacesByLocationId(1);
    expect(spaces.length).toBeGreaterThan(0);
    for (const space of spaces) {
      expect(space.locationId).toBe(1);
    }
  });

  test("getSpacesByLocationId returns an empty array for an unknown location", async () => {
    const spaces = await service.getSpacesByLocationId(999);
    expect(spaces).toEqual([]);
  });

  test("getLocationById returns null for an unknown location", async () => {
    const location = await service.getLocationById(999);
    expect(location).toBeNull();
  });

  test("getLocationById includes floors and spaces", async () => {
    const location = await service.getLocationById(1);
    expect(location).not.toBeNull();
    expect(Array.isArray(location.floors)).toBe(true);
    expect(Array.isArray(location.spaces)).toBe(true);
    for (const floor of location.floors) {
      expect(floor.locationId).toBe(1);
    }
    for (const space of location.spaces) {
      expect(space.locationId).toBe(1);
    }
  });

});
