import React from 'react';
import { useRouter } from 'expo-router';
import { UserProfileScreen } from '../../src/screens/UserProfileScreen';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <UserProfileScreen
      onBack={() => router.replace('/(tabs)/index')}
      onSelectLocation={(loc) =>
        router.push({
          pathname: '/place-details',
          params: { id: loc.id },
        })
      }
    />
  );
}
