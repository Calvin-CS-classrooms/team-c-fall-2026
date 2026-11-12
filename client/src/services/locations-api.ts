// Fetches campus location data from the Express server

import type { ImageProps } from 'expo-image';

import type { Location } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Give up quickly when the server isn't running so the app can fall back to bundled data.
const REQUEST_TIMEOUT_MS = 3000;

// Location images are bundled with the app (they are static and few), so the
// server sends a stable string key rather than an asset. This map resolves
// each key to its bundled asset. Unknown keys fall back to a name-based
// placeholder so images always render.
const IMAGE_BY_KEY: Record<string, ImageProps['source']> = {
  hekman_library: require('@/assets/images/hekman_library.jpg'),
  'dining-hall-min': require('@/assets/images/dining-hall-min.jpg'),
  'business-building': require('@/assets/images/business-building.jpg'),
  'north-hall': require('@/assets/images/north-hall.jpg'),
  'spoelhof-fieldhouse': require('@/assets/images/spoelhof-fieldhouse.avif'),
  'devries-greenhouse': require('@/assets/images/devries-greenhouse.webp'),
  'cfac-practice-lounges': require('@/assets/images/cfac-practice-lounges.jpg'),
  'morren-fitness': require('@/assets/images/morren-fitness.jpg'),
  'peets-coffee': require('@/assets/images/peets-coffee.webp'),
};

// Resolves a server image value to something expo-image can render:
//   - a full URL is passed through as-is (used for space images from the DB),
//   - a known location key maps to a bundled asset,
//   - anything else falls back to a name-based placeholder.
function resolveImage(image: string | undefined, name: string): ImageProps['source'] {
  if (image && /^https?:\/\//.test(image)) {
    return { uri: image };
  }
  if (image && IMAGE_BY_KEY[image]) {
    return IMAGE_BY_KEY[image];
  }
  return { uri: `https://placehold.co/400x200?text=${encodeURIComponent(name)}` };
}

export async function fetchLocations(): Promise<Location[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/locations`, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }

  const locations = (await response.json()) as Location[];
  return locations.map((location) => ({
    ...location,
    image: resolveImage(location.image as string | undefined, location.name),
  }));
}
