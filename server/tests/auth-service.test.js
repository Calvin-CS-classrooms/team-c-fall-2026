// Tests the account-creation business logic (services/auth-service.js) with
// the data layer mocked, so no Supabase project or email is involved.

jest.mock("../data", () => ({
  createAuthUser: jest.fn(),
}));

const repository = require("../data");
const { createAccount } = require("../services/auth-service");

const valid = {
  firstName: "  Jane ",
  lastName: " Doe ",
  email: "  Jane.Doe@Calvin.edu ",
  password: "correct horse",
};

beforeEach(() => {
  jest.resetAllMocks();
  repository.createAuthUser.mockResolvedValue({ userId: "uuid-1", alreadyRegistered: false, emailSent: false });
});

describe("createAccount", () => {

  test("creates the account with a trimmed, lower-case email and trimmed names", async () => {
    const result = await createAccount(valid);

    expect(repository.createAuthUser).toHaveBeenCalledWith({
      email: "jane.doe@calvin.edu",
      password: "correct horse",
      firstName: "Jane",
      lastName: "Doe",
    });
    expect(result).toEqual({ email: "jane.doe@calvin.edu", emailSent: false });
  });

  test("reports when the data layer did send a confirmation email", async () => {
    repository.createAuthUser.mockResolvedValue({ userId: "uuid-1", alreadyRegistered: false, emailSent: true });

    await expect(createAccount(valid)).resolves.toEqual({ email: "jane.doe@calvin.edu", emailSent: true });
  });

  test("treats a blank last name as no last name", async () => {
    await createAccount({ ...valid, lastName: "   " });

    expect(repository.createAuthUser).toHaveBeenCalledWith(expect.objectContaining({ lastName: null }));
  });

  test.each([
    ["a non-Calvin email", { email: "jane@gmail.com" }, "email"],
    ["a missing email", { email: "" }, "email"],
    ["a missing first name", { firstName: "  " }, "firstName"],
    ["a first name over 50 characters", { firstName: "J".repeat(51) }, "firstName"],
    ["a password under 8 characters", { password: "short" }, "password"],
    ["a password over 72 characters", { password: "p".repeat(73) }, "password"],
  ])("rejects %s with a 400 on that field, without calling Supabase", async (_label, change, field) => {
    await expect(createAccount({ ...valid, ...change })).rejects.toMatchObject({ status: 400, field });
    expect(repository.createAuthUser).not.toHaveBeenCalled();
  });

  test("rejects a request with no body", async () => {
    await expect(createAccount(undefined)).rejects.toMatchObject({ status: 400 });
  });

  test("returns 409 when the email already has an account", async () => {
    repository.createAuthUser.mockResolvedValue({ userId: null, alreadyRegistered: true });

    await expect(createAccount(valid)).rejects.toMatchObject({
      status: 409,
      message: expect.stringMatching(/already exists/i),
    });
  });

  test.each([
    ["weak_password", 400, /password is too weak/i],
    ["over_email_send_rate_limit", 429, /too many/i],
    ["email_address_not_authorized", 503, /SMTP/],
    ["signup_disabled", 503, /disabled/i],
  ])("turns Supabase's %s error into a %s with a clear message", async (code, status, message) => {
    repository.createAuthUser.mockRejectedValue(Object.assign(new Error("supabase says no"), { code }));

    await expect(createAccount(valid)).rejects.toMatchObject({ status, message: expect.stringMatching(message) });
  });

  test("passes unexpected errors through unchanged", async () => {
    const unexpected = new Error("connection reset");
    repository.createAuthUser.mockRejectedValue(unexpected);

    await expect(createAccount(valid)).rejects.toBe(unexpected);
  });

});
