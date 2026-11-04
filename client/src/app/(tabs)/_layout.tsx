import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from 'expo-router';

import { Colors } from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      backBehavior="history"
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
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="ratings"
        options={{
          title: 'Add Rating',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-sharp" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="map-location-dot" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Octicons name="person" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen name="suggestions" options={{ title: 'Suggest a Space', href: null }} />
    </Tabs>
  );
}
