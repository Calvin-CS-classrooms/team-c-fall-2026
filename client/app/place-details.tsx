import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PlaceDetailsScreen } from '../src/screens/PlaceDetailsScreen';
import { SURVEY_SPACES } from '../src/data/surveySpaces';

export default function PlaceDetailsRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const location =
    SURVEY_SPACES.find((l) => l.id === id);

  return (
    <PlaceDetailsScreen
      location={location}
      onBack={() => router.back()}
      onProfileClick={() => router.push('/(tabs)/profile')}
    />
  );
}
