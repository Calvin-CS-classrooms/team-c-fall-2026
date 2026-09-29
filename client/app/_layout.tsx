import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="place-details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="select-location" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="write-review" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="suggested-ratings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="confirmation" options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}
