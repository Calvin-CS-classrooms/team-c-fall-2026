import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RecommendationScreen } from '../src/screens/RecommendationScreen';

export default function RecommendationRoute() {
  const router = useRouter();
  const { query } = useLocalSearchParams<{ query?: string }>();

  return (
    <RecommendationScreen
      key={query}
      userQuery={query || 'Where is the best place to study?'}
      onViewDetails={(locationId) => router.push({ pathname: '/place-details', params: { id: locationId } })}
      onProfileClick={() => router.push('/(tabs)/profile')}
      onMenuClick={() => router.back()}
    />
  );
}
