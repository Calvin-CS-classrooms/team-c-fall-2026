// Tests POST /api/auth/signup end to end against the mock data layer
// (USE_MOCK_DATA=true in jest.setup.js), so no email is sent.

const request = require("supertest");
const app = require("../app");

// Each test uses its own email, because the mock data layer remembers sign-ups.
const body = (email) => ({ firstName: "Jane", lastName: "Doe", email, password: "correct horse" });

describe("POST /api/auth/signup", () => {

  test("creates the account and says that no email was sent (sign-up is mock-only for now)", async () => {
    const response = await request(app).post("/api/auth/signup").send(body("route.new@calvin.edu"));

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      email: "route.new@calvin.edu",
      emailSent: false,
      message: expect.stringMatching(/no email was sent/i),
    });
  });

  test("returns 409 when the email already has an account", async () => {
    await request(app).post("/api/auth/signup").send(body("route.twice@calvin.edu"));
    const response = await request(app).post("/api/auth/signup").send(body("route.twice@calvin.edu"));

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toMatch(/already exists/i);
  });

  test("returns 400 with the field name for a non-Calvin email", async () => {
    const response = await request(app).post("/api/auth/signup").send(body("jane@gmail.com"));

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: expect.stringMatching(/calvin\.edu/), field: "email" });
  });

  test("returns 400 for an empty body", async () => {
    const response = await request(app).post("/api/auth/signup").send({});

    expect(response.statusCode).toBe(400);
  });

  test("answers CORS preflight for the Expo web client", async () => {
    const response = await request(app)
      .options("/api/auth/signup")
      .set("Origin", "http://localhost:8081")
      .set("Access-Control-Request-Method", "POST");

    expect(response.statusCode).toBe(204);
  });

});
