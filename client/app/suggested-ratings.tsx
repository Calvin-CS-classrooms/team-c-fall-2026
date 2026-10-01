import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SuggestedRatingsScreen } from '../src/screens/SuggestedRatingsScreen';
import { CAMPUS_LOCATIONS } from '../src/data/mockData';

export default function SuggestedRatingsRoute() {
  const router = useRouter();
  const { id, snippet } = useLocalSearchParams<{ id?: string; snippet?: string }>();

  const location =
    CAMPUS_LOCATIONS.find((l) => l.id === id) || CAMPUS_LOCATIONS[0];

  return (
    <SuggestedRatingsScreen
      location={location}
      reviewSnippet={
        snippet
          ? `“${snippet.slice(0, 75)}...”`
          : '“Pin-drop quiet right now... working power outlet... 70% of seats taken...”'
      }
      onBack={() => router.back()}
      onConfirmSubmit={() => router.replace('/confirmation')}
      onEditManually={() => router.back()}
      onProfileClick={() => router.push('/(tabs)/profile')}
    />
  );
}
