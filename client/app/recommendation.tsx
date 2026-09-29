import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RecommendationScreen } from '../src/screens/RecommendationScreen';

export default function RecommendationRoute() {
  const router = useRouter();
  const { query } = useLocalSearchParams<{ query?: string }>();

  return (
    <RecommendationScreen
      userQuery={query || 'Where is the best place to study on campus at 7 PM?'}
      onViewDetails={() => router.push('/place-details')}
      onProfileClick={() => router.push('/(tabs)/profile')}
      onMenuClick={() => router.back()}
      onPreviewMap={() => router.push('/(tabs)/map')}
    />
  );
}
