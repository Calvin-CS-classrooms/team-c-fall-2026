// Repository facade.
//
// Exposes a single repository interface to the business logic layer. The
// implementation is chosen at load time based on USE_MOCK_DATA:
//   - true  -> server/data/mock-repository.js (bundled mock data)
//   - false -> server/data/supabase-repository.js (live Supabase)
//
// The business logic layer and routes never know which source is active.

const { USE_MOCK_DATA } = require("../config/data-source");

const repository = USE_MOCK_DATA
  ? require("./mock-repository")
  : require("./supabase-repository");

module.exports = repository;
