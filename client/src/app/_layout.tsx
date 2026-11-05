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
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { AppProvider, useAppData } from '@/context/app-context';

// REST API: load campus locations from the server and cache them in memory.
import { setLocations } from '@/data/locations';
import { fetchLocations } from '@/services/locations-api';

// Keep the native splash screen visible until the app finishes initializing
// (fonts loaded and locations fetched) so users don't see a blank screen.
SplashScreen.preventAutoHideAsync();

/**
 * Root layout for the app.
 *
 * Responsibilities:
 *  - Load the Montserrat font family.
 *  - Fetch campus locations from the server before showing the UI.
 *  - Show a retryable error screen if the location server cannot be reached.
 *  - Render the app (via AppProvider + RootNavigator) once initialization succeeds.
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

  // Whether campus locations were successfully fetched from the server.
  const [locationsLoaded, setLocationsLoaded] = useState(false);
  // Holds the error that prevented locations from loading, if any.
  const [loadError, setLoadError] = useState<Error | null>(null);
  // Incremented by the Retry button to re-trigger the initialization effect.
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Wait for fonts before attempting to load locations.
    if (!fontsLoaded) return;

    async function initializeApp() {
      try {
        setLoadError(null);
        // Fetch locations from the server and store them for the rest of the app.
        const serverLocations = await fetchLocations();
        setLocations(serverLocations);
        setLocationsLoaded(true);
      } catch (error) {
        // Normalize the error so we always have a message to display.
        const initializationError =
          error instanceof Error ? error : new Error('The location server could not be reached.');
        setLoadError(initializationError);
        setLocationsLoaded(false);
      } finally {
        // Always hide the splash screen once initialization finishes, success or failure.
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
    // Re-run when fonts finish loading or when the user taps Retry.
  }, [fontsLoaded, retryCount]);

  // Keep the splash screen up (render nothing) until fonts are ready and
  // locations have either loaded or failed.
  if (!fontsLoaded || (!locationsLoaded && !loadError)) {
    return null;
  }

  // Show a friendly error screen with a Retry button when the server is unreachable.
  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to load campus locations</Text>
        <Text style={styles.errorMessage}>
          Connect to the local server and try again. The app does not use offline location data.
        </Text>
        <Text style={styles.errorDetails}>{loadError.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => setRetryCount((count) => count + 1)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
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
const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorDetails: {
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.maroon,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
