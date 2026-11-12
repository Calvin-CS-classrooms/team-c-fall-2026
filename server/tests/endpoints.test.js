// Tests the REST endpoints for spaces, ratings, favorites, reference data,
// and notifications, including edge cases (empty results, 404s, derived metrics).

const request = require("supertest");
const app = require("../app");
const mockSpaces = require("../data-mock/spaces");
const mockRatings = require("../data-mock/ratings");
const mockFloors = require("../data-mock/floors");
const mockFavorites = require("../data-mock/favorites");
const mockNotifications = require("../data-mock/notifications");
const mockAmenities = require("../data-mock/amenities");
const mockCategories = require("../data-mock/categories");

describe("Spaces API", () => {

  test("GET all spaces returns every space", async () => {
    const response = await request(app).get("/api/spaces");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(mockSpaces.length);
  });

  test("GET all spaces enriches each space with derived metrics", async () => {
    const response = await request(app).get("/api/spaces");

    for (const space of response.body) {
      expect(space).toHaveProperty("overallRating");
      expect(space).toHaveProperty("crowdRating");
      expect(space).toHaveProperty("currentNoiseLevel");
    }
  });

  test("GET a space by id returns the space with derived metrics", async () => {
    const response = await request(app).get("/api/spaces/6");

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(6);
    expect(response.body.name).toBe("Van Reken Quiet Floor");
    // Space 6 has one rating (id 1): 5 stars, crowd 15, whisper.
    expect(response.body.overallRating).toBe(5);
    expect(response.body.crowdRating).toBe(15);
    expect(response.body.currentNoiseLevel).toBe("whisper");
  });

  test("GET a space with no ratings has zeroed derived metrics", async () => {
    const response = await request(app).get("/api/spaces/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.overallRating).toBe(0);
    expect(response.body.crowdRating).toBe(0);
    expect(response.body.currentNoiseLevel).toBeNull();
  });

  test("GET spaces by location returns only that location's spaces", async () => {
    const response = await request(app).get("/api/spaces/location/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    for (const space of response.body) {
      expect(space.locationId).toBe(1);
    }
  });

  test("GET spaces by unknown location returns an empty array", async () => {
    const response = await request(app).get("/api/spaces/location/999");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("GET an unknown space returns 404", async () => {
    const response = await request(app).get("/api/spaces/999");

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Space not found");
  });

  test("GET a non-numeric space id returns 404", async () => {
    const response = await request(app).get("/api/spaces/abc");

    expect(response.statusCode).toBe(404);
  });

});

describe("Ratings API", () => {

  test("GET all ratings returns every rating", async () => {
    const response = await request(app).get("/api/ratings");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(mockRatings.length);
  });

  test("GET ratings by space returns only that space's ratings", async () => {
    const response = await request(app).get("/api/ratings/space/6");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    for (const rating of response.body) {
      expect(rating.spaceId).toBe(6);
    }
  });

  test("GET ratings by space with no ratings returns an empty array", async () => {
    const response = await request(app).get("/api/ratings/space/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

});

describe("Favorites API", () => {

  test("GET favorites by user returns only that user's favorites", async () => {
    const response = await request(app).get("/api/favorites/user/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    for (const favorite of response.body) {
      expect(favorite.userId).toBe(1);
    }
  });

  test("GET favorites by user with no favorites returns an empty array", async () => {
    const response = await request(app).get("/api/favorites/user/999");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

});

describe("Reference API", () => {

  test("GET amenities returns every amenity", async () => {
    const response = await request(app).get("/api/reference/amenities");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(mockAmenities.length);
  });

  test("GET categories returns every category", async () => {
    const response = await request(app).get("/api/reference/categories");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(mockCategories.length);
  });

});

describe("Notifications API", () => {

  test("GET notifications by user returns only that user's notifications", async () => {
    const response = await request(app).get("/api/notifications/user/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    for (const notification of response.body) {
      expect(notification.userId).toBe(1);
    }
  });

  test("GET notifications by user with none returns an empty array", async () => {
    const response = await request(app).get("/api/notifications/user/999");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

});
