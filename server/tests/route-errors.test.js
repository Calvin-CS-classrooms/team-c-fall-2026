// Tests that routes return 500 with a JSON error when the business logic
// layer throws, covering the catch branches in every router.

jest.mock("../services/campus-service", () => ({
  getLocations: jest.fn(),
  getLocationById: jest.fn(),
  getSpaces: jest.fn(),
  getSpaceById: jest.fn(),
  getSpacesByLocationId: jest.fn(),
  getRatings: jest.fn(),
  getRatingsBySpaceId: jest.fn(),
  getFavoritesByUserId: jest.fn(),
  getAmenities: jest.fn(),
  getCategories: jest.fn(),
  getNotificationsByUserId: jest.fn(),
}));

const request = require("supertest");
const app = require("../app");
const service = require("../services/campus-service");

// Make every service function throw by default; individual tests override.
const boom = new Error("boom");
for (const key of Object.keys(service)) {
  service[key].mockRejectedValue(boom);
}

describe("Route error handling", () => {

  test("GET /api/locations returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/locations");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/locations/:id returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/locations/1");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/spaces returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/spaces");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/spaces/:id returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/spaces/1");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/spaces/location/:id returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/spaces/location/1");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/ratings returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/ratings");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/ratings/space/:id returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/ratings/space/1");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/favorites/user/:id returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/favorites/user/1");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/reference/amenities returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/reference/amenities");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/reference/categories returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/reference/categories");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

  test("GET /api/notifications/user/:id returns 500 when the service throws", async () => {
    const response = await request(app).get("/api/notifications/user/1");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("boom");
  });

});
