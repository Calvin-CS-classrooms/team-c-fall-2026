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


  test("a new account can then be found by login's user lookup", async () => {
    await request(app).post("/api/auth/signup").send(body("route.login@calvin.edu"));
    const response = await request(app).get("/api/users/by-email/route.login%40calvin.edu");

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      email: "route.login@calvin.edu",
      firstName: "Jane",
      lastName: "Doe",
      deletionScheduledFor: null,
    });
    expect(Number.isInteger(response.body.id)).toBe(true);
  });

  test("gives each new account its own id", async () => {
    await request(app).post("/api/auth/signup").send(body("route.first@calvin.edu"));
    await request(app).post("/api/auth/signup").send(body("route.second@calvin.edu"));
    const first = await request(app).get("/api/users/by-email/route.first%40calvin.edu");
    const second = await request(app).get("/api/users/by-email/route.second%40calvin.edu");

    expect(first.body.id).not.toBe(second.body.id);
  });

  test("treats a sample student's email as already taken", async () => {
    const response = await request(app).post("/api/auth/signup").send(body("Emma.K@calvin.edu"));

    expect(response.statusCode).toBe(409);
  });

});
