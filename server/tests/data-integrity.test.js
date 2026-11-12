// Validates referential integrity and shape of the mock data across all
// entities, so a typo or broken reference is caught before it reaches the API.

const locations = require("../data-mock/locations");
const spaces = require("../data-mock/spaces");
const floors = require("../data-mock/floors");
const ratings = require("../data-mock/ratings");
const favorites = require("../data-mock/favorites");
const notifications = require("../data-mock/notifications");
const amenities = require("../data-mock/amenities");
const categories = require("../data-mock/categories");

const NOISE_LEVELS = ["whisper", "lowBuzz", "social", "loud"];

const locationIds = new Set(locations.map((l) => l.id));
const spaceIds = new Set(spaces.map((s) => s.id));
const floorIds = new Set(floors.map((f) => f.id));
const categoryIds = new Set(categories.map((c) => c.id));
const amenityIds = new Set(amenities.map((a) => a.id));
const userIds = new Set([1, 2, 3, 4]);

describe("Spaces mock data", () => {

  test("has unique ids and references only existing locations, floors, and categories", () => {
    const ids = spaces.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const space of spaces) {
      expect(locationIds.has(space.locationId)).toBe(true);
      expect(floorIds.has(space.floorId)).toBe(true);
      expect(categoryIds.has(space.categoryId)).toBe(true);
      expect(NOISE_LEVELS).toContain(space.noiseLevel);
      expect(typeof space.name).toBe("string");
      expect(space.name.length).toBeGreaterThan(0);
    }
  });

  test("every space has a unique floor", () => {
    const floorIdsUsed = spaces.map((s) => s.floorId);
    expect(new Set(floorIdsUsed).size).toBe(floorIdsUsed.length);
  });

});

describe("Floors mock data", () => {

  test("has unique ids and references only existing locations", () => {
    const ids = floors.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const floor of floors) {
      expect(locationIds.has(floor.locationId)).toBe(true);
      expect(NOISE_LEVELS).toContain(floor.noiseLevel);
    }
  });

  test("every location has at least one floor", () => {
    for (const location of locations) {
      expect(floors.some((f) => f.locationId === location.id)).toBe(true);
    }
  });

});

describe("Ratings mock data", () => {

  test("has unique ids and references only existing users and spaces", () => {
    const ids = ratings.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const rating of ratings) {
      expect(userIds.has(rating.userId)).toBe(true);
      expect(spaceIds.has(rating.spaceId)).toBe(true);
      expect(NOISE_LEVELS).toContain(rating.perceivedNoise);
      expect(rating.numStars).toBeGreaterThanOrEqual(1);
      expect(rating.numStars).toBeLessThanOrEqual(5);
      expect(rating.crowdRating).toBeGreaterThanOrEqual(0);
      expect(rating.crowdRating).toBeLessThanOrEqual(100);
    }
  });

});

describe("Favorites mock data", () => {

  test("references only existing users and spaces", () => {
    for (const favorite of favorites) {
      expect(userIds.has(favorite.userId)).toBe(true);
      expect(spaceIds.has(favorite.spaceId)).toBe(true);
    }
  });

  test("has no duplicate (userId, spaceId) pairs", () => {
    const keys = favorites.map((f) => `${f.userId}-${f.spaceId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

});

describe("Notifications mock data", () => {

  test("references only existing users and spaces", () => {
    for (const notification of notifications) {
      expect(userIds.has(notification.userId)).toBe(true);
      expect(spaceIds.has(notification.spaceId)).toBe(true);
      expect(typeof notification.message).toBe("string");
      expect(notification.message.length).toBeGreaterThan(0);
      expect(typeof notification.isRead).toBe("boolean");
    }
  });

});

describe("Amenities and categories mock data", () => {

  test("have unique ids and non-empty names", () => {
    for (const list of [amenities, categories]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const item of list) {
        expect(typeof item.name).toBe("string");
        expect(item.name.length).toBeGreaterThan(0);
      }
    }
  });

});
