// Fetches campus location data from the Express server

import type { Location } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Give up quickly when the server isn't running so the app can fall back to bundled data.
const REQUEST_TIMEOUT_MS = 3000;

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

  return (await response.json()) as Location[];
}
