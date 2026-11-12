// Tests the RESTful API to make sure locations are retrieved correctly and invalid requests return the proper errors

const request = require("supertest");
const app = require("../app");
const mockLocations = require("../data-mock/locations");

describe("Locations API", () => {

  test("GET all locations", async () => {
    const response = await request(app).get("/api/locations");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(mockLocations.length);
  });

  test("GET a location by numeric id", async () => {
    const response = await request(app).get("/api/locations/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe("Prince Conference Center");
  });

  test("GET location includes required data", async () => {
    const response = await request(app).get("/api/locations/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("image");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("numFloors");
    expect(response.body).toHaveProperty("numSpaces");
    expect(response.body).toHaveProperty("hours");
    expect(Array.isArray(response.body.floors)).toBe(true);
    expect(Array.isArray(response.body.spaces)).toBe(true);
  });

  test("GET invalid location returns 404", async () => {
    const response = await request(app).get(
      "/api/locations/does-not-exist"
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Location not found");
  });

});