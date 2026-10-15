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

