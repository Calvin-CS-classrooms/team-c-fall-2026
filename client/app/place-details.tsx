import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PlaceDetailsScreen } from '../src/screens/PlaceDetailsScreen';
import { CAMPUS_LOCATIONS } from '../src/data/mockData';

export default function PlaceDetailsRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const location =
    CAMPUS_LOCATIONS.find((l) => l.id === id) || CAMPUS_LOCATIONS[0];

  return (
    <PlaceDetailsScreen
      location={location}
      onBack={() => router.back()}
      onChat={() => router.back()}
      onRateThisPlace={(loc) =>
        router.push({
          pathname: '/write-review',
          params: { id: loc.id },
        })
      }
      onProfileClick={() => router.push('/(tabs)/profile')}
    />
  );
}
