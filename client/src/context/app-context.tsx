import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { initialFavorites } from '@/data/favorites';
import { initialRatings } from '@/data/ratings';
import type { AppSettings, CampusLocation, FavoriteSpot, NewRatingInput, UserRating } from '@/types';

interface AppContextValue {
  calvinEmail: string | null;
  setCalvinEmail: (email: string | null) => void;
  ratings: UserRating[];
  addRating: (input: NewRatingInput) => void;
  markHelpful: (id: string) => void;
  deleteRating: (id: string) => void;
  favorites: FavoriteSpot[];
  toggleFavorite: (location: CampusLocation) => void;
  removeFavorite: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
  settings: AppSettings;
  toggleSetting: (key: keyof AppSettings) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Module-level counter used to generate unique ids for locally created
// ratings (there is no backend yet).
let ratingIdCounter = 0;

/**
 * Provides all app-wide state (Calvin email, ratings, favorites, settings)
 * to the component tree via context. Acts as a client-only stand-in for a
 * backend: state lives in memory and is seeded from mock data.
 */
export function AppProvider({ children }: PropsWithChildren) {
  const [calvinEmail, setCalvinEmail] = useState<string | null>(null);
  const [ratings, setRatings] = useState<UserRating[]>(initialRatings);
  const [favorites, setFavorites] = useState<FavoriteSpot[]>(initialFavorites);
  const [settings, setSettings] = useState<AppSettings>({
    geolocation: true,
    anonymousMode: false,
    capacityAlerts: true,
  });

  // Adds a rating only if the user has a verified Calvin email; new ratings
  // are prepended so the most recent appears first.
  const addRating = useCallback((input: NewRatingInput) => {
    if (!calvinEmail) {
      return;
    }

    ratingIdCounter += 1;
    const newRating: UserRating = {
      id: `local-rating-${ratingIdCounter}`,
      helpfulCount: 0,
      createdMinutesAgo: 0,
      ...input,
    };
    setRatings((prev) => [newRating, ...prev]);
  }, [calvinEmail]);

  // Increments the helpful count on the matching rating.
  const markHelpful = useCallback((id: string) => {
    setRatings((prev) =>
      prev.map((rating) => (rating.id === id ? { ...rating, helpfulCount: rating.helpfulCount + 1 } : rating)),
    );
  }, []);

  // Removes the rating with the given id.
  const deleteRating = useCallback((id: string) => {
    setRatings((prev) => prev.filter((rating) => rating.id !== id));
  }, []);

  // Adds the location to favorites if absent, or removes it if already
  // present (i.e. toggles the favorite state).
  const toggleFavorite = useCallback((location: CampusLocation) => {
    setFavorites((prev) => {
      const exists = prev.some((favorite) => favorite.locationId === location.id);
      if (exists) {
        return prev.filter((favorite) => favorite.locationId !== location.id);
      }
      return [...prev, { locationId: location.id, name: location.name, category: location.category }];
    });
  }, []);

  // Removes the favorite with the given location id.
  const removeFavorite = useCallback((locationId: string) => {
    setFavorites((prev) => prev.filter((favorite) => favorite.locationId !== locationId));
  }, []);

  // Whether the given location id is currently favorited.
  const isFavorite = useCallback(
    (locationId: string) => favorites.some((favorite) => favorite.locationId === locationId),
    [favorites],
  );

  // Flips the boolean value of the given setting key.
  const toggleSetting = useCallback((key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const value = useMemo(
    () => ({
      calvinEmail,
      setCalvinEmail,
      ratings,
      addRating,
      markHelpful,
      deleteRating,
      favorites,
      toggleFavorite,
      removeFavorite,
      isFavorite,
      settings,
      toggleSetting,
    }),
    [
      calvinEmail,
      ratings,
      addRating,
      markHelpful,
      deleteRating,
      favorites,
      toggleFavorite,
      removeFavorite,
      isFavorite,
      settings,
      toggleSetting,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook for consuming app state; throws if used outside an AppProvider so
// misuse fails loudly instead of silently returning undefined.
export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  return context;
}
