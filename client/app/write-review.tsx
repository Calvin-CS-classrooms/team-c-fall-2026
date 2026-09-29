import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WriteReviewScreen } from '../src/screens/WriteReviewScreen';
import { CAMPUS_LOCATIONS } from '../src/data/mockData';

export default function WriteReviewRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const location =
    CAMPUS_LOCATIONS.find((l) => l.id === id) || CAMPUS_LOCATIONS[0];

  return (
    <WriteReviewScreen
      location={location}
      onBack={() => router.back()}
      onAnalyzeReview={(text) =>
        router.push({
          pathname: '/suggested-ratings',
          params: { id: location.id, snippet: text },
        })
      }
      onSkipToManual={() =>
        router.push({
          pathname: '/suggested-ratings',
          params: { id: location.id },
        })
      }
      onProfileClick={() => router.push('/(tabs)/profile')}
    />
  );
}
