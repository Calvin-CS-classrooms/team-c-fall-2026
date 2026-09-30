import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ConfirmationScreen } from '../src/screens/ConfirmationScreen';
import { CAMPUS_LOCATIONS } from '../src/data/mockData';

export default function ConfirmationRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const location =
    CAMPUS_LOCATIONS.find((l) => l.id === id) || CAMPUS_LOCATIONS[0];

  return (
    <ConfirmationScreen
      location={location}
      onBackToChat={() => router.dismissAll()}
      onRateAnotherSpace={() => router.replace('/select-location')}
      onProfileClick={() => router.push('/(tabs)/profile')}
    />
  );
}
