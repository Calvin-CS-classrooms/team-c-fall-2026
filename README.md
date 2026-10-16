[Jump to Setup](#running-the-client-calvin-ratings-app)

# Team-C-Fall-2026

John Cho  
Wilson Hornbaker  
Grant McKenzie  
Kevin Ofori-Kwafo  
Ezer Ouoba  
Ponjul Shedul


## Team Documents

- [Team Contract](team-contract.md)

## Vision Statement
- [Vision Statement doc](vision-statement.md)
<br><br>
**Calvin Ratings** is a campus discovery and decision-making app for Calvin University students and staff. It combines recent community reports with place and event information so users can decide where to go, what to expect, and which campus resources fit their needs. Unlike Calvin's official website or generic review and map apps, it provides Calvin-specific context, location-purpose information, campus-only participation, and clearly timestamped ratings for current conditions.
<br><br>

## Running the Client (Calvin Ratings App)

The client is an [Expo](https://expo.dev) React Native app located in the [`client/`](./client) directory. It uses Expo Router for file-based navigation.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (bundled with Node.js)
- The [Expo Go](https://expo.dev/go) app on your phone, **or** an Android emulator / iOS simulator

### Steps

1. **Install dependencies**

   ```bash
   cd client
   npm install
   ```

2. **Start the Expo dev server**

   ```bash
   npx expo start
   ```

3. **Open the app**

   In the terminal output, you'll see options to launch the app:
   - Press `a` to open on an **Android** emulator
   - Press `i` to open on an **iOS** simulator
   - Press `w` to open in a **web** browser
   - Or scan the QR code with the **Expo Go** app on your phone (make sure your phone and computer are on the same network)

### Useful scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start and open on an Android emulator |
| `npm run ios` | Start and open on an iOS simulator |
| `npm run web` | Start and open in a web browser |
| `npm test` | Run the Jest unit tests |

## Running the Server (REST API)

The server is a Node.js/Express REST API located in the [`server/`](./server) directory. It serves the location data that the client can fetch from `http://localhost:3000`.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (bundled with Node.js)

### Steps

1. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Start the server**

   ```bash
   npm start
   ```

   The server runs at `http://localhost:3000`.

### Useful scripts

| Command | Description |
|---|---|
| `npm start` | Start the Express server on port 3000 |
| `npm test` | Run the Jest API tests |

> **Note:** To have the client load data from the server, **keep the server running in one terminal and the client (`npx expo start`) running in another.** If the server is not running, the client falls back to its local mock data.
