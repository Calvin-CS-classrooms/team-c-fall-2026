import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { initialFavorites } from '@/data/favorites';
import { initialRatings } from '@/data/ratings';
import type { AppSettings, CampusLocation, FavoriteSpot, NewRatingInput, UserRating } from '@/types';

interface AppContextValue {
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

let ratingIdCounter = 0;

export function AppProvider({ children }: PropsWithChildren) {
  const [ratings, setRatings] = useState<UserRating[]>(initialRatings);
  const [favorites, setFavorites] = useState<FavoriteSpot[]>(initialFavorites);
  const [settings, setSettings] = useState<AppSettings>({
    geolocation: true,
    anonymousMode: false,
    capacityAlerts: true,
  });

  const addRating = useCallback((input: NewRatingInput) => {
    ratingIdCounter += 1;
    const newRating: UserRating = {
      id: `local-rating-${ratingIdCounter}`,
      helpfulCount: 0,
      createdMinutesAgo: 0,
      ...input,
    };
    setRatings((prev) => [newRating, ...prev]);
  }, []);

  const markHelpful = useCallback((id: string) => {
    setRatings((prev) =>
      prev.map((rating) => (rating.id === id ? { ...rating, helpfulCount: rating.helpfulCount + 1 } : rating)),
    );
  }, []);

  const deleteRating = useCallback((id: string) => {
    setRatings((prev) => prev.filter((rating) => rating.id !== id));
  }, []);

  const toggleFavorite = useCallback((location: CampusLocation) => {
    setFavorites((prev) => {
      const exists = prev.some((favorite) => favorite.locationId === location.id);
      if (exists) {
        return prev.filter((favorite) => favorite.locationId !== location.id);
      }
      return [...prev, { locationId: location.id, name: location.name, category: location.category }];
    });
  }, []);

  const removeFavorite = useCallback((locationId: string) => {
    setFavorites((prev) => prev.filter((favorite) => favorite.locationId !== locationId));
  }, []);

  const isFavorite = useCallback(
    (locationId: string) => favorites.some((favorite) => favorite.locationId === locationId),
    [favorites],
  );

  const toggleSetting = useCallback((key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const value = useMemo(
    () => ({
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

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  return context;
}
