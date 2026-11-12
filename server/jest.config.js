// Jest configuration for the server.
//
// Tests run against the bundled mock data (USE_MOCK_DATA=true) so they are
// deterministic and do not require a live Supabase database or credentials.

module.exports = {
  testEnvironment: "node",
  setupFiles: ["./jest.setup.js"],
};
