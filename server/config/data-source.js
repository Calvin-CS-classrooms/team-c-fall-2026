// Selects the data source for the server: local mock data or live Supabase.
//
// Set USE_MOCK_DATA=true in the environment to serve the bundled mock data
// (useful for development without a database). When unset/false, the server
// queries Supabase. The client cannot tell the difference — both sources
// return the same shapes.

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

module.exports = { USE_MOCK_DATA };
