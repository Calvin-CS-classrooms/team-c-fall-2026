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

//Additional stuff for Rest API
import { setLocations } from '@/data/locations';
import { fetchLocations } from '@/services/locations-api';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  const [locationsLoaded, setLocationsLoaded] = useState(false);

  useEffect(() => {
  if (!fontsLoaded) return;

  async function initializeApp() {
    try {
      const serverLocations = await fetchLocations();
      setLocations(serverLocations);
      console.log('Loaded locations from API:', serverLocations.length);
    } catch (error) {
      console.warn('API unavailable, using local mock locations:', error);
    } finally {
      setLocationsLoaded(true);
      SplashScreen.hideAsync();
    }
  }

  initializeApp();
}, [fontsLoaded]);

  if (!fontsLoaded || !locationsLoaded) {
  return null;
  }

  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}

// Signed-out users only see the login page; the tabs are reachable only after logging in.
function RootNavigator() {
  const { account } = useAppData();
  const isLoggedIn = Boolean(account);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
