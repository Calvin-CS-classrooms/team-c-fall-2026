// Starts the Express server on port 3000, allowing the React Native app to request data from our RESTful API.

// Load server/.env before anything else: config/data-source.js and config/supabase.js
// read process.env when they are first required (via ./app).
require("dotenv").config({ path: `${__dirname}/.env`, quiet: true });

const app = require("./app");
const { USE_MOCK_DATA } = require("./config/data-source");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} using ${USE_MOCK_DATA ? "mock data" : "Supabase"}`);
});
