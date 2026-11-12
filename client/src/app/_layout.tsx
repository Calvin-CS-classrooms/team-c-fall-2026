import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { Colors } from '@/constants/colors';
import { AppProvider, useAppData } from '@/context/app-context';

// REST API: load locations, spaces, and ratings from the server into memory.
import { loadCampusData } from '@/services/campus-api';

// Keep the native splash screen visible until the app finishes initializing
// (fonts loaded and campus data fetched) so users don't see a blank screen.
SplashScreen.preventAutoHideAsync();

/**
 * Root layout for the app.
 *
 * Responsibilities:
 *  - Load the Montserrat font family.
 *  - Fetch campus locations, spaces, and ratings from the server before showing the UI.
 *  - Fall back to the bundled data if the server cannot be reached.
 *  - Render the app (via AppProvider + RootNavigator) once initialization finishes.
 *
 * @returns The app's root UI, or null while still initializing.
 */
export default function RootLayout() {
  // Tracks whether the Montserrat fonts have finished loading.
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  // Whether location loading has finished (from the server or the bundled fallback).
  const [locationsLoaded, setLocationsLoaded] = useState(false);

  useEffect(() => {
    // Wait for fonts before attempting to load locations.
    if (!fontsLoaded) return;

    async function initializeApp() {
      try {
        // Prefer live data from the server. On failure this keeps the bundled
        // data (and logs a warning) so the client can also run on its own.
        await loadCampusData();
      } finally {
        // Always continue and hide the splash screen, success or fallback.
        setLocationsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, [fontsLoaded]);

  // Keep the splash screen up (render nothing) until fonts and locations are ready.
  if (!fontsLoaded || !locationsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}

/**
 * Sets up the navigation stack and guards routes based on auth state.
 *
 * Signed-out users only see the login page; the tabs are reachable only
 * after logging in. The Stack.Protected guards swap which screens are
 * available depending on whether an account is present.
 */
function RootNavigator() {
  const { account } = useAppData();
  const isLoggedIn = Boolean(account);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      {/* Only show the main tabs when the user is logged in. */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      {/* Only show the login screen when the user is signed out. */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
