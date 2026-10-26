import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { AppProvider } from '@/context/app-context';

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
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!fontsLoaded) return;

    async function initializeApp() {
      try {
        setLoadError(null);
        const serverLocations = await fetchLocations();
        setLocations(serverLocations);
        setLocationsLoaded(true);
      } catch (error) {
        const initializationError =
          error instanceof Error ? error : new Error('The location server could not be reached.');
        setLoadError(initializationError);
        setLocationsLoaded(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, [fontsLoaded, retryCount]);

  if (!fontsLoaded || (!locationsLoaded && !loadError)) {
    return null;
  }

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
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.maroon,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="ratings"
          options={{
            title: 'Add Rating',
            tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-sharp" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ color, size }) => <FontAwesome6 name="map-location-dot" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <Octicons name="person" size={size} color={color} />,
          }}
        />
      </Tabs>
    </AppProvider>
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
