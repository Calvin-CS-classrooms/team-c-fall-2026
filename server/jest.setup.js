// Runs before each test file. Forces the server to use the bundled mock data
// so tests never require a live Supabase database or credentials.

process.env.USE_MOCK_DATA = "true";
