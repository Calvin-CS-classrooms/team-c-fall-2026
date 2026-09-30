import React from 'react';
import { useRouter } from 'expo-router';
import { surveyDetailsRoute } from '../../src/utils/surveyMap';
import { CampusMapScreen } from '../../src/screens/CampusMapScreen';

export default function MapScreen() {
  const router = useRouter();

  return (
    <CampusMapScreen
      onSelectLocation={(loc) => router.push(surveyDetailsRoute(loc))}
      onProfileClick={() => router.push('/(tabs)/profile')}
    />
  );
}
