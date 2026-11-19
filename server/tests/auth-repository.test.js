// Tests createAuthUser in the Supabase data layer with a mocked Supabase
// client: what it sends to auth.signUp and how it reads the response.

const signUp = jest.fn();

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({ auth: { signUp } })),
}));

// config/supabase.js refuses to load without credentials, so give it placeholders.
process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
const { createAuthUser } = require("../data/supabase-repository");

const input = { email: "jane@calvin.edu", password: "correct horse", firstName: "Jane", lastName: "Doe" };

beforeEach(() => {
  signUp.mockReset();
  delete process.env.AUTH_REDIRECT_URL;
});

describe("createAuthUser", () => {

  test("signs up with the email and password and stores the name as user metadata", async () => {
    signUp.mockResolvedValue({ data: { user: { id: "uuid-1", identities: [{ id: "i1" }] }, session: null }, error: null });

    await createAuthUser(input);

    expect(signUp).toHaveBeenCalledWith({
      email: "jane@calvin.edu",
      password: "correct horse",
      options: { data: { firstName: "Jane", lastName: "Doe" } },
    });
  });

  test("sends confirmation links to AUTH_REDIRECT_URL when it is set", async () => {
    process.env.AUTH_REDIRECT_URL = "http://localhost:8081/login";
    signUp.mockResolvedValue({ data: { user: { id: "uuid-1", identities: [{ id: "i1" }] } }, error: null });

    await createAuthUser(input);

    expect(signUp.mock.calls[0][0].options.emailRedirectTo).toBe("http://localhost:8081/login");
  });

  test("returns the new user's id", async () => {
    signUp.mockResolvedValue({ data: { user: { id: "uuid-1", identities: [{ id: "i1" }] } }, error: null });

    await expect(createAuthUser(input)).resolves.toEqual({ userId: "uuid-1", alreadyRegistered: false });
  });

  test("reports an existing account when Supabase returns a user with no identities", async () => {
    // With email confirmation on, Supabase hides existing accounts by
    // returning an obfuscated user whose identities list is empty.
    signUp.mockResolvedValue({ data: { user: { id: "fake", identities: [] } }, error: null });

    await expect(createAuthUser(input)).resolves.toEqual({ userId: null, alreadyRegistered: true });
  });

  test("reports an existing account for the user_already_exists error", async () => {
    signUp.mockResolvedValue({ data: { user: null }, error: { code: "user_already_exists", message: "User already registered" } });

    await expect(createAuthUser(input)).resolves.toEqual({ userId: null, alreadyRegistered: true });
  });

  test("throws other Supabase errors with their code", async () => {
    signUp.mockResolvedValue({ data: { user: null }, error: { code: "weak_password", message: "Password is too weak" } });

    await expect(createAuthUser(input)).rejects.toMatchObject({ code: "weak_password", message: "Password is too weak" });
  });

});
