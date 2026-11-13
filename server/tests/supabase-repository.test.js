// Tests the Supabase database access layer by mocking the Supabase client.
// Verifies that each repository function builds the correct table/query and
// that errors are propagated. These tests do not require a live database.

// A mutable fake client that the repository will use. Each test sets
// fakeClient.from to return the desired query chain.
const fakeClient = {
  from: () => {
    throw new Error("from not stubbed");
  },
};

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => fakeClient),
}));

// The repository requires ../config/supabase, which calls createClient() and
// returns fakeClient. Require it after the mock is set up.
// config/supabase.js refuses to load without credentials, so give it placeholders.
// They are never used: createClient is mocked above.
process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
const repository = require("../data/supabase-repository");

// Builds a query chain that resolves with the given data/error and records
// the table, eq column/value, and whether maybeSingle was used.
function stubQuery({ data = [], error = null } = {}) {
  const recorded = { table: null, eqColumn: null, eqValue: null, maybeSingle: false };
  fakeClient.from = (table) => {
    recorded.table = table;
    return {
      select: () => ({
        eq: (column, value) => {
          recorded.eqColumn = column;
          recorded.eqValue = value;
          return {
            maybeSingle: () => {
              recorded.maybeSingle = true;
              return { then: (resolve) => resolve({ data, error }) };
            },
            then: (resolve) => resolve({ data, error }),
          };
        },
        then: (resolve) => resolve({ data, error }),
      }),
    };
  };
  return recorded;
}

describe("Supabase repository", () => {

  test("getAllLocations queries the locations table", async () => {
    const recorded = stubQuery({ data: [{ id: 1, name: "Test" }] });
    const result = await repository.getAllLocations();
    expect(recorded.table).toBe("locations");
    expect(result).toEqual([{ id: 1, name: "Test" }]);
  });

  test("getLocationById filters by id and uses maybeSingle", async () => {
    const recorded = stubQuery({ data: { id: 1, name: "Test" } });
    const result = await repository.getLocationById(1);
    expect(recorded.table).toBe("locations");
    expect(recorded.eqColumn).toBe("id");
    expect(recorded.eqValue).toBe(1);
    expect(recorded.maybeSingle).toBe(true);
    expect(result).toEqual({ id: 1, name: "Test" });
  });

  test("getAllSpaces queries the spaces table", async () => {
    const recorded = stubQuery({ data: [{ id: 1 }] });
    await repository.getAllSpaces();
    expect(recorded.table).toBe("spaces");
  });

  test("getSpaceById filters by id and uses maybeSingle", async () => {
    const recorded = stubQuery({ data: { id: 1 } });
    await repository.getSpaceById(1);
    expect(recorded.table).toBe("spaces");
    expect(recorded.eqColumn).toBe("id");
    expect(recorded.eqValue).toBe(1);
    expect(recorded.maybeSingle).toBe(true);
  });

  test("getSpacesByLocationId filters by locationId", async () => {
    const recorded = stubQuery({ data: [{ id: 1, locationId: 2 }] });
    const result = await repository.getSpacesByLocationId(2);
    expect(recorded.table).toBe("spaces");
    expect(recorded.eqColumn).toBe("locationId");
    expect(recorded.eqValue).toBe(2);
    expect(result).toEqual([{ id: 1, locationId: 2 }]);
  });

  test("getAllFloors queries the floors table", async () => {
    const recorded = stubQuery({ data: [{ id: 1 }] });
    await repository.getAllFloors();
    expect(recorded.table).toBe("floors");
  });

  test("getFloorsByLocationId filters by locationId", async () => {
    const recorded = stubQuery({ data: [{ id: 1, locationId: 2 }] });
    await repository.getFloorsByLocationId(2);
    expect(recorded.table).toBe("floors");
    expect(recorded.eqColumn).toBe("locationId");
    expect(recorded.eqValue).toBe(2);
  });

  test("getAllRatings queries the ratings table", async () => {
    const recorded = stubQuery({ data: [{ id: 1 }] });
    await repository.getAllRatings();
    expect(recorded.table).toBe("ratings");
  });

  test("getRatingsBySpaceId filters by spaceId", async () => {
    const recorded = stubQuery({ data: [{ id: 1, spaceId: 6 }] });
    const result = await repository.getRatingsBySpaceId(6);
    expect(recorded.table).toBe("ratings");
    expect(recorded.eqColumn).toBe("spaceId");
    expect(recorded.eqValue).toBe(6);
    expect(result).toEqual([{ id: 1, spaceId: 6 }]);
  });

  test("getAllFavorites queries the favorites table", async () => {
    const recorded = stubQuery({ data: [{ userId: 1 }] });
    await repository.getAllFavorites();
    expect(recorded.table).toBe("favorites");
  });

  test("getFavoritesByUserId filters by userId", async () => {
    const recorded = stubQuery({ data: [{ userId: 1, spaceId: 6 }] });
    const result = await repository.getFavoritesByUserId(1);
    expect(recorded.table).toBe("favorites");
    expect(recorded.eqColumn).toBe("userId");
    expect(recorded.eqValue).toBe(1);
    expect(result).toEqual([{ userId: 1, spaceId: 6 }]);
  });

  test("getAllAmenities queries the amenities table", async () => {
    const recorded = stubQuery({ data: [{ id: 1 }] });
    await repository.getAllAmenities();
    expect(recorded.table).toBe("amenities");
  });

  test("getAllCategories queries the categories table", async () => {
    const recorded = stubQuery({ data: [{ id: 1 }] });
    await repository.getAllCategories();
    expect(recorded.table).toBe("categories");
  });

  test("getAllNotifications queries the notifications table", async () => {
    const recorded = stubQuery({ data: [{ id: 1 }] });
    await repository.getAllNotifications();
    expect(recorded.table).toBe("notifications");
  });

  test("getNotificationsByUserId filters by userId", async () => {
    const recorded = stubQuery({ data: [{ id: 1, userId: 1 }] });
    const result = await repository.getNotificationsByUserId(1);
    expect(recorded.table).toBe("notifications");
    expect(recorded.eqColumn).toBe("userId");
    expect(recorded.eqValue).toBe(1);
    expect(result).toEqual([{ id: 1, userId: 1 }]);
  });

  test("propagates errors from the database", async () => {
    stubQuery({ error: new Error("db down") });
    await expect(repository.getAllLocations()).rejects.toThrow("db down");
  });

});
