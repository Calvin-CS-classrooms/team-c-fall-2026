# Calvin Ratings — Campus Pulse (React Native / Expo)

A React Native mobile app built with **Expo SDK 57** that provides real-time campus spot recommendations and crowdsourced study ratings for Calvin University.

## Tech Stack

- **Expo SDK 57** (React Native 0.85, React 19.2)
- **Expo Router** (file-based navigation)
- **TypeScript**
- **@expo/vector-icons** (MaterialIcons)

## Run Locally

**Prerequisites:** Node.js (LTS)

1. Install dependencies:
   ```sh
   npm install
   ```

2. Start the Expo dev server:
   ```sh
   npm start
   ```

3. Run on a specific platform:
   ```sh
   npm run android   # Android emulator / device
   npm run ios       # iOS simulator (macOS only)
   npm run web       # Web browser
   ```

Then scan the QR code with the **Expo Go** app on your device, or press `a` / `i` to open an emulator.

## Project Structure

```
client/
├── app.json             # Expo app configuration
├── assets/              # App icons & splash
├── app/                 # Expo Router file-based routes
│   ├── _layout.tsx      # Root Stack layout
│   ├── (tabs)/          # Bottom tab group (Explore, Map, Profile)
│   │   ├── _layout.tsx
│   │   ├── index.tsx    # Explore (Chat Home)
│   │   ├── map.tsx      # Campus Map
│   │   └── profile.tsx  # User Profile
│   ├── recommendation.tsx
│   ├── place-details.tsx
│   ├── select-location.tsx
│   ├── write-review.tsx
│   ├── suggested-ratings.tsx
│   └── confirmation.tsx
└── src/
    ├── theme.ts         # Central color palette
    ├── components/      # TopHeader, BottomNavBar, shared UI
    ├── data/            # Mock campus location data
    └── screens/         # 9 app screens (presentational)
```

## Screens

- Chat Home (Explore tab)
- Recommendation
- Place Details
- Select Location
- Write Review
- Suggested Ratings
- Confirmation
- Campus Map (Map tab)
- User Profile (Profile tab)

