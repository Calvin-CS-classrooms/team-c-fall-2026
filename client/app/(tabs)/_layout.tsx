import { Tabs } from 'expo-router';
import { BottomNavBar, MainTab } from '../../src/components/BottomNavBar';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();

  // Map the router route name to the MainTab type ('index' -> 'explore')
  const routeToTab: Record<string, MainTab> = {
    index: 'explore',
    map: 'map',
    profile: 'profile',
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        const routeName = props.state.routes[props.state.index].name;
        return (
          <BottomNavBar
            currentTab={routeToTab[routeName] ?? 'explore'}
            onSelectTab={(tab) => {
              const routeName = tab === 'explore' ? 'index' : tab;
              router.push(`/(tabs)/${routeName}`);
            }}
            onCreateRating={() => router.push('/select-location')}
          />
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Explore' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
