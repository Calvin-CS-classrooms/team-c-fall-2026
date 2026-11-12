// Loads the app's campus data (locations, spaces, ratings) from the REST API.

import { setLocations } from '@/data/locations';
import { setInitialRatings } from '@/data/ratings';
import { setSpaces } from '@/data/spaces';
import { fetchJson } from '@/services/api-client';
import { fetchLocations } from '@/services/locations-api';
import type { Location, NoiseLevel, Rating, Space } from '@/types';

/** A space as the server sends it: no rating yet means no current noise level. */
export type ApiSpace = Omit<Space, 'image' | 'currentNoiseLevel'> & {
  image?: string | null;
  currentNoiseLevel: NoiseLevel | null;
};

/** A location as the server sends it, with its spaces (and floors) nested inside. */
export type ApiLocation = Location & { spaces?: ApiSpace[]; floors?: unknown[] };

/** Fetches every rating from GET /api/ratings. */
export function fetchRatings(): Promise<Rating[]> {
  return fetchJson<Rating[]>('/api/ratings');
}

/**
 * Pulls the spaces out of the server's location response and adapts them to
 * the client's Space type:
 *  - the server reports `currentNoiseLevel: null` for a space nobody has rated;
 *    the UI always needs a level, so it falls back to the typical `noiseLevel`;
 *  - a space image is a URL string in the database, turned into an image source.
 */
export function spacesFromLocations(locations: ApiLocation[]): Space[] {
  return locations.flatMap((location) =>
    (location.spaces ?? []).map(({ image, currentNoiseLevel, ...space }) => ({
      ...space,
      currentNoiseLevel: currentNoiseLevel ?? space.noiseLevel,
      ...(image ? { image: { uri: image } } : {}),
    })),
  );
}

/**
 * Replaces the bundled locations, spaces, and ratings with the server's data.
 *
 * All-or-nothing on purpose: the server's ids do not line up with the bundled
 * data's ids, so keeping, say, bundled spaces next to server locations would
 * show spaces and ratings under the wrong buildings. If any request fails,
 * nothing is replaced and the app runs entirely on bundled data.
 *
 * Must run before <AppProvider> mounts, since the provider copies the ratings
 * into state when it first renders.
 *
 * @returns 'server' when live data was loaded, 'bundled' when it fell back.
 */
export async function loadCampusData(): Promise<'server' | 'bundled'> {
  try {
    const [locations, ratings] = await Promise.all([
      fetchLocations() as Promise<ApiLocation[]>,
      fetchRatings(),
    ]);

    const spaces = spacesFromLocations(locations);
    setLocations(locations.map(({ spaces: _spaces, floors: _floors, ...location }) => location));
    setSpaces(spaces);
    setInitialRatings(ratings);
    return 'server';
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`Campus data server unavailable (${reason}); using bundled data.`);
    return 'bundled';
  }
}
