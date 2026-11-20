// Repository facade.
//
// Exposes a single repository interface to the business logic layer. The
// implementation is chosen at load time based on USE_MOCK_DATA:
//   - true  -> server/data/mock-repository.js (bundled mock data)
//   - false -> server/data/supabase-repository.js (live Supabase)
//
// The business logic layer and routes never know which source is active.
//
// Exception: sign-up (createAuthUser) always uses the mock repository for now,
// so no real Supabase account is created and no email is sent. The Supabase
// version is commented out in supabase-repository.js until the team decides
// how accounts and email confirmation should work. To switch it back on,
// uncomment it there and remove the createAuthUser override below.

const { USE_MOCK_DATA } = require("../config/data-source");
const mockRepository = require("./mock-repository");

const repository = USE_MOCK_DATA ? mockRepository : require("./supabase-repository");

module.exports = {
  ...repository,
  createAuthUser: mockRepository.createAuthUser,
};
