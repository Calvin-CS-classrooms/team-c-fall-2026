import React from 'react';
import { useRouter } from 'expo-router';
import { ChatHomeScreen } from '../../src/screens/ChatHomeScreen';

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ChatHomeScreen
      onAskQuestion={(query) => {
        router.push({
          pathname: '/recommendation',
          params: { query },
        });
      }}
      onGoToSelectLocation={() => router.push('/select-location')}
      onOpenProfile={() => router.push('/(tabs)/profile')}
    />
  );
}
