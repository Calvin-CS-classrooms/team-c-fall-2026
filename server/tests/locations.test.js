// Tests the RESTful API to make sure locations are retrieved correctly and invalid requests return the proper errors

const request = require("supertest");
const app = require("../app");

describe("Locations API", () => {

  test("GET all locations", async () => {
    const response = await request(app).get("/api/locations");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(9);
  });

  test("GET Hekman Library", async () => {
    const response = await request(app).get(
      "/api/locations/hekman-library"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe("hekman-library");
    expect(response.body.name).toBe("Hekman Library");
    expect(response.body.category).toBe("study");
  });

  test("GET location includes required data", async () => {
    const response = await request(app).get(
      "/api/locations/hekman-library"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("capacity");
    expect(response.body).toHaveProperty("density");
    expect(response.body).toHaveProperty("noise");
    expect(response.body).toHaveProperty("rating");
    expect(response.body).toHaveProperty("amenities");
    expect(response.body).toHaveProperty("floors");
    expect(response.body).toHaveProperty("imageKey");
  });

  test("GET invalid location returns 404", async () => {
    const response = await request(app).get(
      "/api/locations/does-not-exist"
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Location not found");
  });

});