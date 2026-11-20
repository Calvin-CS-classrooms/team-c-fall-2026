// Finds the campus building the student is in, using the phone's location.

import * as ExpoLocation from 'expo-location';
import { useEffect, useMemo, useState } from 'react';

import type { Location } from '@/types';
import { nearestBuilding, type Coordinates } from '@/utils/geo';

/**
 * - off: Geolocation is turned off in Profile, so location isn't read
 * - locating: asking permission / reading the position
 * - denied: the student didn't allow location access
 * - unavailable: the position couldn't be read (e.g. location services off)
 * - not-near: no building with coordinates is close enough
 * - found: `building` is the building the student is in
 */
export type LocationStatus = 'off' | 'locating' | 'denied' | 'unavailable' | 'not-near' | 'found';

type Reading = { kind: 'locating' } | { kind: 'denied' } | { kind: 'unavailable' } | { kind: 'position'; coords: Coordinates };

/**
 * Reads the phone's position once (and again on `retry`) while `enabled`, and
 * returns the building the student is in.
 *
 * Only foreground ("while using the app") permission is requested, and the
 * position never leaves the device: it is only compared with the buildings'
 * coordinates here.
 *
 * @param enabled - The Geolocation setting from Profile.
 * @param locations - Buildings to choose from; those without coordinates are skipped.
 */
export function useCurrentBuilding(enabled: boolean, locations: Location[]) {
  const [reading, setReading] = useState<Reading>({ kind: 'locating' });
  // Bumped by retry() to read the position again.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        const permission = await ExpoLocation.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (!permission.granted) {
          setReading({ kind: 'denied' });
          return;
        }
        const position = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
        if (cancelled) return;
        setReading({
          kind: 'position',
          coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        });
      } catch {
        if (!cancelled) setReading({ kind: 'unavailable' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, attempt]);

  // The building is worked out from the last position, so it updates if the
  // list of buildings changes (e.g. once server data loads) without a new GPS read.
  const nearest = useMemo(
    () => (reading.kind === 'position' ? nearestBuilding(reading.coords, locations) : undefined),
    [reading, locations],
  );

  let status: LocationStatus;
  if (!enabled) status = 'off';
  else if (reading.kind === 'position') status = nearest ? 'found' : 'not-near';
  else status = reading.kind;

  const retry = () => {
    setReading({ kind: 'locating' });
    setAttempt((count) => count + 1);
  };

  return { status, building: nearest?.location, distance: nearest?.distance, retry };
}
