// Tests server configuration: the Supabase client refuses to start without
// credentials, and USE_MOCK_DATA picks the repository implementation.

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({ from: jest.fn() })),
}));

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe("config/supabase", () => {

  test("throws a helpful error when SUPABASE_URL is missing", () => {
    delete process.env.SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "key";

    expect(() => require("../config/supabase")).toThrow(/server\/\.env\.example/);
  });

  test("throws a helpful error when the service role key is missing", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(() => require("../config/supabase")).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  test("creates a client without session persistence when both values are set", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "key";

    require("../config/supabase");
    const { createClient } = require("@supabase/supabase-js");

    expect(createClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "key",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  });

});

describe("data source selection", () => {

  test("USE_MOCK_DATA=true uses the mock repository", () => {
    process.env.USE_MOCK_DATA = "true";

    expect(require("../data")).toBe(require("../data/mock-repository"));
  });

  test("any other value uses the Supabase repository", () => {
    process.env.USE_MOCK_DATA = "false";
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "key";

    expect(require("../data")).toBe(require("../data/supabase-repository"));
  });

});
