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

cd server npm install npm start

The server runs at `http://localhost:3000`.

Terminal 2 - React Native

From the main project folder, open another terminal:

cd client npm install npx expo start

Press W to open the website.

Keep both terminals running so the React Native app can retrieve data from the API.

Testing:

To run the API tests, open a terminal inside `server` and run:

npm test

All four API tests passed.
