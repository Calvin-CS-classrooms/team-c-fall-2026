import React from 'react';
import { useRouter } from 'expo-router';
import { CampusMapScreen } from '../../src/screens/CampusMapScreen';

export default function MapScreen() {
  const router = useRouter();

  return (
    <CampusMapScreen
      onSelectLocation={(loc) =>
        router.push({
          pathname: '/place-details',
          params: { id: loc.id },
        })
      }
      onRateLocation={(loc) =>
        router.push({
          pathname: '/write-review',
          params: { id: loc.id },
        })
      }
      onProfileClick={() => router.push('/(tabs)/profile')}
    />
  );
}
