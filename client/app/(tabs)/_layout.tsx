import { Tabs, useRouter } from 'expo-router';
import { BottomNavBar, MainTab } from '../../src/components/BottomNavBar';

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
              const target = tab === 'explore' ? 'index' : tab;
              // Use navigation.navigate to switch the active tab
              props.navigation.navigate(target);
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
