// Tests the business logic layer (services/campus-service.js) in isolation.
//
// The data access layer (../data) is replaced with Jest mocks, so every test
// controls exactly which rows the "database" returns. Nothing here touches the
// bundled mock data or Supabase. Route-level behavior is covered separately in
// endpoints.test.js.

jest.mock("../data", () => ({
  getAllLocations: jest.fn(),
  getLocationById: jest.fn(),
  getAllSpaces: jest.fn(),
  getSpaceById: jest.fn(),
  getSpacesByLocationId: jest.fn(),
  getAllFloors: jest.fn(),
  getFloorsByLocationId: jest.fn(),
  getAllRatings: jest.fn(),
  getRatingsBySpaceId: jest.fn(),
  getAllFavorites: jest.fn(),
  getFavoritesByUserId: jest.fn(),
  getAllAmenities: jest.fn(),
  getAllCategories: jest.fn(),
  getAllNotifications: jest.fn(),
  getNotificationsByUserId: jest.fn(),
}));

const repository = require("../data");
const service = require("../services/campus-service");

const HOUR = 60 * 60 * 1000;
const NOW = Date.parse("2026-11-12T12:00:00Z");

// Builds a rating row; `hoursAgo` sets createdAt relative to NOW.
function rating({ hoursAgo = 1, ...overrides } = {}) {
  return {
    id: 1,
    userId: 1,
    spaceId: 1,
    createdAt: new Date(NOW - hoursAgo * HOUR).toISOString(),
    numStars: 4,
    crowdRating: 50,
    perceivedNoise: "lowBuzz",
    description: "",
    numUpvotes: 0,
    ...overrides,
  };
}

function space(overrides = {}) {
  return { id: 1, locationId: 1, categoryId: 1, floorId: 1, name: "Space", noiseLevel: "lowBuzz", ...overrides };
}

beforeEach(() => {
  jest.resetAllMocks();
});

// --- Pure metric rules -----------------------------------------------------

describe("computeOverallRating", () => {

  test("is 0 when there are no ratings", () => {
    expect(service.computeOverallRating([])).toBe(0);
    expect(service.computeOverallRating(undefined)).toBe(0);
  });

  test("is the star count of a single rating", () => {
    expect(service.computeOverallRating([rating({ numStars: 3 })])).toBe(3);
  });

  test("averages the star ratings", () => {
    const ratings = [rating({ numStars: 5 }), rating({ numStars: 4 })];
    expect(service.computeOverallRating(ratings)).toBe(4.5);
  });

  test("rounds to one decimal place", () => {
    // (5 + 4 + 4) / 3 = 4.333...
    const ratings = [rating({ numStars: 5 }), rating({ numStars: 4 }), rating({ numStars: 4 })];
    expect(service.computeOverallRating(ratings)).toBe(4.3);
    // (5 + 5 + 4) / 3 = 4.666...
    const higher = [rating({ numStars: 5 }), rating({ numStars: 5 }), rating({ numStars: 4 })];
    expect(service.computeOverallRating(higher)).toBe(4.7);
  });

});

describe("computeCrowdRating", () => {

  test("is 0 when there are no ratings", () => {
    expect(service.computeCrowdRating([])).toBe(0);
  });

  test("uses the most recent rating, not the average", () => {
    const ratings = [
      rating({ hoursAgo: 5, crowdRating: 10 }),
      rating({ hoursAgo: 1, crowdRating: 80 }),
      rating({ hoursAgo: 3, crowdRating: 30 }),
    ];
    expect(service.computeCrowdRating(ratings)).toBe(80);
  });

  test("does not depend on the order rows come back in", () => {
    const newest = rating({ hoursAgo: 1, crowdRating: 80 });
    const oldest = rating({ hoursAgo: 9, crowdRating: 10 });
    expect(service.computeCrowdRating([newest, oldest])).toBe(80);
    expect(service.computeCrowdRating([oldest, newest])).toBe(80);
  });

});

describe("computeCurrentNoiseLevel", () => {

  test("is null when there are no ratings", () => {
    expect(service.computeCurrentNoiseLevel([])).toBeNull();
  });

  test("uses the perceived noise of the most recent rating", () => {
    const ratings = [
      rating({ hoursAgo: 2, perceivedNoise: "whisper" }),
      rating({ hoursAgo: 0.5, perceivedNoise: "loud" }),
    ];
    expect(service.computeCurrentNoiseLevel(ratings)).toBe("loud");
  });

});

// --- Spaces ----------------------------------------------------------------

describe("getSpaces", () => {

  test("adds metrics computed only from each space's own ratings", async () => {
    repository.getAllSpaces.mockResolvedValue([space({ id: 1 }), space({ id: 2 })]);
    repository.getAllRatings.mockResolvedValue([
      rating({ spaceId: 1, numStars: 5, crowdRating: 20, perceivedNoise: "whisper" }),
      rating({ spaceId: 1, numStars: 3, hoursAgo: 4 }),
      rating({ spaceId: 2, numStars: 1, crowdRating: 90, perceivedNoise: "loud" }),
    ]);

    const [first, second] = await service.getSpaces();

    expect(first).toMatchObject({ id: 1, overallRating: 4, crowdRating: 20, currentNoiseLevel: "whisper" });
    expect(second).toMatchObject({ id: 2, overallRating: 1, crowdRating: 90, currentNoiseLevel: "loud" });
  });

  test("gives a space with no ratings zeroed metrics", async () => {
    repository.getAllSpaces.mockResolvedValue([space({ id: 3 })]);
    repository.getAllRatings.mockResolvedValue([rating({ spaceId: 1 })]);

    const [result] = await service.getSpaces();

    expect(result).toMatchObject({ overallRating: 0, crowdRating: 0, currentNoiseLevel: null });
  });

  test("overrides stale metric values stored on the space row", async () => {
    repository.getAllSpaces.mockResolvedValue([space({ id: 1, overallRating: 1.2, crowdRating: 99 })]);
    repository.getAllRatings.mockResolvedValue([rating({ spaceId: 1, numStars: 5, crowdRating: 10 })]);

    const [result] = await service.getSpaces();

    expect(result.overallRating).toBe(5);
    expect(result.crowdRating).toBe(10);
  });

  test("keeps the original space fields", async () => {
    repository.getAllSpaces.mockResolvedValue([space({ id: 1, name: "Quiet Floor", floorId: 4 })]);
    repository.getAllRatings.mockResolvedValue([]);

    const [result] = await service.getSpaces();

    expect(result).toMatchObject({ id: 1, name: "Quiet Floor", floorId: 4, locationId: 1 });
  });

  test("returns an empty list when there are no spaces", async () => {
    repository.getAllSpaces.mockResolvedValue([]);
    repository.getAllRatings.mockResolvedValue([rating()]);

    await expect(service.getSpaces()).resolves.toEqual([]);
  });

  test("passes database errors up to the caller", async () => {
    repository.getAllSpaces.mockRejectedValue(new Error("connection refused"));
    repository.getAllRatings.mockResolvedValue([]);

    await expect(service.getSpaces()).rejects.toThrow("connection refused");
  });

});

describe("getSpaceById", () => {

  test("returns null and skips the ratings query for an unknown space", async () => {
    repository.getSpaceById.mockResolvedValue(null);

    await expect(service.getSpaceById(999)).resolves.toBeNull();
    expect(repository.getRatingsBySpaceId).not.toHaveBeenCalled();
  });

  test("loads only that space's ratings and adds metrics", async () => {
    repository.getSpaceById.mockResolvedValue(space({ id: 7 }));
    repository.getRatingsBySpaceId.mockResolvedValue([
      rating({ spaceId: 7, numStars: 2, hoursAgo: 3, crowdRating: 70 }),
      rating({ spaceId: 7, numStars: 4, hoursAgo: 1, crowdRating: 25, perceivedNoise: "social" }),
    ]);

    const result = await service.getSpaceById(7);

    expect(repository.getRatingsBySpaceId).toHaveBeenCalledWith(7);
    expect(result).toMatchObject({ id: 7, overallRating: 3, crowdRating: 25, currentNoiseLevel: "social" });
  });

});

describe("getSpacesByLocationId", () => {

  test("queries spaces for the location and enriches them", async () => {
    repository.getSpacesByLocationId.mockResolvedValue([space({ id: 4, locationId: 2 })]);
    repository.getAllRatings.mockResolvedValue([rating({ spaceId: 4, numStars: 5 })]);

    const result = await service.getSpacesByLocationId(2);

    expect(repository.getSpacesByLocationId).toHaveBeenCalledWith(2);
    expect(result).toEqual([expect.objectContaining({ id: 4, overallRating: 5 })]);
  });

  test("returns an empty list for a location with no spaces", async () => {
    repository.getSpacesByLocationId.mockResolvedValue([]);
    repository.getAllRatings.mockResolvedValue([]);

    await expect(service.getSpacesByLocationId(999)).resolves.toEqual([]);
  });

});

// --- Locations -------------------------------------------------------------

describe("getLocations", () => {

  test("nests each location's own floors and enriched spaces", async () => {
    repository.getAllLocations.mockResolvedValue([{ id: 1, name: "Library" }, { id: 2, name: "Gym" }]);
    repository.getAllFloors.mockResolvedValue([
      { id: 10, locationId: 1, name: "Floor 1" },
      { id: 20, locationId: 2, name: "Court" },
      { id: 11, locationId: 1, name: "Floor 2" },
    ]);
    repository.getAllSpaces.mockResolvedValue([space({ id: 100, locationId: 1 }), space({ id: 200, locationId: 2 })]);
    repository.getAllRatings.mockResolvedValue([rating({ spaceId: 200, numStars: 3 })]);

    const [library, gym] = await service.getLocations();

    expect(library.floors.map((floor) => floor.id)).toEqual([10, 11]);
    expect(library.spaces.map((s) => s.id)).toEqual([100]);
    expect(library.spaces[0].overallRating).toBe(0);
    expect(gym.floors.map((floor) => floor.id)).toEqual([20]);
    expect(gym.spaces[0].overallRating).toBe(3);
  });

  test("gives a location with no floors or spaces empty arrays", async () => {
    repository.getAllLocations.mockResolvedValue([{ id: 5, name: "Empty Hall" }]);
    repository.getAllFloors.mockResolvedValue([]);
    repository.getAllSpaces.mockResolvedValue([]);
    repository.getAllRatings.mockResolvedValue([]);

    const [location] = await service.getLocations();

    expect(location).toEqual({ id: 5, name: "Empty Hall", floors: [], spaces: [] });
  });

});

describe("getLocationById", () => {

  test("returns null and skips the follow-up queries for an unknown location", async () => {
    repository.getLocationById.mockResolvedValue(null);

    await expect(service.getLocationById(999)).resolves.toBeNull();
    expect(repository.getFloorsByLocationId).not.toHaveBeenCalled();
    expect(repository.getSpacesByLocationId).not.toHaveBeenCalled();
  });

  test("includes the location's floors and enriched spaces", async () => {
    repository.getLocationById.mockResolvedValue({ id: 1, name: "Library" });
    repository.getFloorsByLocationId.mockResolvedValue([{ id: 10, locationId: 1 }]);
    repository.getSpacesByLocationId.mockResolvedValue([space({ id: 100, locationId: 1 })]);
    repository.getAllRatings.mockResolvedValue([rating({ spaceId: 100, numStars: 4 })]);

    const location = await service.getLocationById(1);

    expect(repository.getFloorsByLocationId).toHaveBeenCalledWith(1);
    expect(location.floors).toEqual([{ id: 10, locationId: 1 }]);
    expect(location.spaces).toEqual([expect.objectContaining({ id: 100, overallRating: 4 })]);
  });

});

// --- Pass-through queries --------------------------------------------------

describe("pass-through queries", () => {

  test.each([
    ["getRatings", "getAllRatings", []],
    ["getRatingsBySpaceId", "getRatingsBySpaceId", [6]],
    ["getFavoritesByUserId", "getFavoritesByUserId", [1]],
    ["getAmenities", "getAllAmenities", []],
    ["getCategories", "getAllCategories", []],
    ["getNotificationsByUserId", "getNotificationsByUserId", [2]],
  ])("%s returns the rows from repository.%s", async (serviceFn, repoFn, args) => {
    const rows = [{ id: 1 }, { id: 2 }];
    repository[repoFn].mockResolvedValue(rows);

    await expect(service[serviceFn](...args)).resolves.toBe(rows);
    expect(repository[repoFn]).toHaveBeenCalledWith(...args);
  });

});
