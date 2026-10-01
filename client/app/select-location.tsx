import React from 'react';
import { useRouter } from 'expo-router';
import { SelectLocationScreen } from '../src/screens/SelectLocationScreen';

export default function SelectLocationRoute() {
  const router = useRouter();

  return (
    <SelectLocationScreen
      onBack={() => router.back()}
      onSelectLocation={(loc) =>
        router.push({
          pathname: '/write-review',
          params: { id: loc.id },
        })
      }
      onProfileClick={() => router.push('/(tabs)/profile')}
    />
  );
}
