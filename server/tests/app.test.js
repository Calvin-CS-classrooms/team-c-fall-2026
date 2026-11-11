// Tests app-level behavior that every route depends on: CORS for the Expo web
// client, JSON responses, unknown routes and methods, and lookups by id.

const request = require("supertest");
const app = require("../app");
const locations = require("../data/locations");

const CLIENT_ORIGIN = "http://localhost:8081";

describe("CORS", () => {

  test("allows requests from the Expo web client", async () => {
    const response = await request(app)
      .get("/api/locations")
      .set("Origin", CLIENT_ORIGIN);

    expect(response.headers["access-control-allow-origin"]).toBe(CLIENT_ORIGIN);
  });

  test("does not allow other origins", async () => {
    const response = await request(app)
      .get("/api/locations")
      .set("Origin", "http://evil.example.com");

    expect(response.headers["access-control-allow-origin"]).not.toBe("http://evil.example.com");
  });

  test("answers preflight requests from the client", async () => {
    const response = await request(app)
      .options("/api/locations")
      .set("Origin", CLIENT_ORIGIN)
      .set("Access-Control-Request-Method", "GET");

    expect(response.statusCode).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(CLIENT_ORIGIN);
  });

});

describe("Responses", () => {

  test("location list is served as JSON", async () => {
    const response = await request(app).get("/api/locations");

    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });

  test("404 errors are also served as JSON", async () => {
    const response = await request(app).get("/api/locations/nope");

    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });

  test("returns every location in the data file, in order", async () => {
    const response = await request(app).get("/api/locations");

    expect(response.body.map(loc => loc.id)).toEqual(locations.map(loc => loc.id));
  });

  test("sends imageKey instead of a client-side image", async () => {
    const response = await request(app).get("/api/locations");

    for (const loc of response.body) {
      expect(loc).toHaveProperty("imageKey");
      expect(loc).not.toHaveProperty("image");
    }
  });

});

describe("GET /api/locations/:id", () => {

  test.each(locations.map(loc => loc.id))("returns %s", async id => {
    const response = await request(app).get(`/api/locations/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(locations.find(loc => loc.id === id));
  });

  test("ids are case-sensitive", async () => {
    const response = await request(app).get("/api/locations/HEKMAN-LIBRARY");

    expect(response.statusCode).toBe(404);
  });

  test("a URL-encoded id that does not exist returns 404", async () => {
    const response = await request(app).get("/api/locations/hekman%20library");

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Location not found");
  });

});

describe("Unknown routes and methods", () => {

  test("an unknown path returns 404", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.statusCode).toBe(404);
  });

  test("the API root is not a resource", async () => {
    const response = await request(app).get("/api");

    expect(response.statusCode).toBe(404);
  });

  test("locations are read-only for now (POST is not handled)", async () => {
    const response = await request(app)
      .post("/api/locations")
      .send({ id: "new-place", name: "New Place" });

    expect(response.statusCode).toBe(404);
  });

  test("DELETE on a location is not handled", async () => {
    const response = await request(app).delete("/api/locations/hekman-library");

    expect(response.statusCode).toBe(404);
  });

});
