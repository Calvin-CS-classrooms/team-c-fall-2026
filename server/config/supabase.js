// Creates the single Supabase client used by the database access layer
// (server/data/supabase-repository.js). Uses the service role key, so this
// module must only ever run on the server.

const { createClient } = require("@supabase/supabase-js");

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

// Fail fast with a clear message instead of supabase-js's generic
// "supabaseUrl is required" when the .env file is missing or incomplete.
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy server/.env.example to server/.env " +
    "and fill them in, or set USE_MOCK_DATA=true to run without a database."
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = supabase;
