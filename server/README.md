RESTful API Setup

What We Changed:

We created a RESTful API using Express.js to provide mock campus location data to our React Native app.

Server Changes:

`server/index.js` - Starts the server.

`server/app.js` - Sets up Express and CORS.

`server/data/locations.js` - Contains the mock location data.

`server/routes/locations.js` - Handles API requests.

`server/tests/locations.test.js` - Tests the API.

Client Changes:

`client/src/services/locations-api.ts` - Retrieves locations from the server.

`client/src/data/locations.ts` - Allows locations to be updated with API data.

`client/src/app/_layout.tsx` - Loads the API data when the app starts and shows a retryable error if the server is unavailable.

The existing screens were left unchanged. The client requires the server's location data before showing the app; it does not silently fall back to the original mock data.

How to Run

You need two separate terminals open in VS Code.

Terminal 1 - Server

From the main project folder:

```bash
cd server
npm install
cp .env.example .env   # then fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm start
```

The server runs at `http://localhost:3000` and logs whether it is using Supabase or mock data.
To run without a database, set `USE_MOCK_DATA=true` in `server/.env`.
Never commit `server/.env`; it holds the service role key and is git-ignored.

Terminal 2 - React Native

From the main project folder, open another terminal:

```bash
cd client
npm install
npx expo start
```

Press W to open the website. If the server is not running, the client falls back to its bundled data.

Testing:

To run the server tests, open a terminal inside `server` and run:

```bash
npm test
```

Server tests always use mock data (see `jest.setup.js`) and mock the Supabase client, so they need no database or credentials.
