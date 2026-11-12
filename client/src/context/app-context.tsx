import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { initialFavorites } from '@/data/favorites';
import { locations as baseLocations } from '@/data/locations';
import { initialRatings } from '@/data/ratings';
import { spaces as baseSpaces } from '@/data/spaces';
import { createInitialSuggestions } from '@/data/suggestions';
import type {
  Account,
  AppSettings,
  Favorites,
  Location,
  NewRatingInput,
  NewSuggestionInput,
  Rating,
  Space,
  SpotSuggestion,
  SuggestionVote,
} from '@/types';
import { isCalvinEmail } from '@/utils/verification';
import { hasSuggestedToday } from '@/utils/suggestions';

export const ACCOUNT_DELETION_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

export const MIN_PASSWORD_LENGTH = 6;

const DEFAULT_SETTINGS: AppSettings = {
  geolocation: true,
  anonymousMode: false,
  capacityAlerts: true,
};

interface AppContextValue {
  account: Account | null;
  /** The verified Calvin email of the signed-in account, or null when there is no verified account. */
  calvinEmail: string | null;
  logIn: (email: string, password: string) => string | null;
  logOut: () => void;
  requestAccountDeletion: () => void;
  cancelAccountDeletion: () => void;
  finalizeAccountDeletion: () => void;
  locations: Location[];
  spaces: Space[];
  ratings: Rating[];
  addRating: (input: NewRatingInput) => void;
  markHelpful: (id: number) => void;
  deleteRating: (id: number) => void;
  suggestions: SpotSuggestion[];
  suggestionVotes: SuggestionVote[];
  submitSuggestion: (input: NewSuggestionInput) => string | null;
  voteOnSuggestion: (id: number, vote: 1 | -1) => void;
  favorites: Favorites[];
  toggleFavorite: (space: Space) => void;
  removeFavorite: (spaceId: number) => void;
  isFavorite: (spaceId: number) => boolean;
  settings: AppSettings;
  toggleSetting: (key: keyof AppSettings) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Module-level counters used to generate unique ids for locally created
// ratings and suggestions (there is no backend yet). They start above the
// highest seeded id so locally created rows never collide with mock data.
let ratingIdCounter = Math.max(0, ...initialRatings.map((rating) => rating.id));
let suggestionIdCounter = Math.max(0, ...createInitialSuggestions().map((suggestion) => suggestion.id));

/** "jane.doe@calvin.edu" -> "Jane Doe" */
export function nameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Provides all app-wide state (account, ratings, suggestions, favorites,
 * settings) to the component tree via context. Acts as a client-only stand-in
 * for a backend: state lives in memory and is seeded from mock data.
 */
export function AppProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<Account | null>(null);
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [suggestions, setSuggestions] = useState<SpotSuggestion[]>(() => createInitialSuggestions());
  const [suggestionVotes, setSuggestionVotes] = useState<SuggestionVote[]>([]);
  const [favorites, setFavorites] = useState<Favorites[]>(initialFavorites);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const calvinEmail = account?.email ?? null;

  // Mock sign-in: any verified Calvin email with a long-enough password is accepted.
  // Passwords are never stored; real authentication needs a backend.
  const logIn = useCallback((email: string, password: string) => {
    if (!isCalvinEmail(email)) return 'Please enter a valid @calvin.edu email.';
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setAccount({
      id: 1,
      name: nameFromEmail(normalizedEmail),
      email: normalizedEmail,
      createdAt: Date.now(),
      deletionScheduledFor: null,
    });
    return null;
  }, []);

  const logOut = useCallback(() => setAccount(null), []);

  const requestAccountDeletion = useCallback(() => {
    setAccount((prev) => (prev ? { ...prev, deletionScheduledFor: Date.now() + ACCOUNT_DELETION_DELAY_MS } : prev));
  }, []);

  const cancelAccountDeletion = useCallback(() => {
    setAccount((prev) => (prev ? { ...prev, deletionScheduledFor: null } : prev));
  }, []);

  // Permanently removes account information. Ratings stay, but lose their owner and show as anonymous.
  const finalizeAccountDeletion = useCallback(() => {
    if (!account) return;
    setFavorites([]);
    setSettings(DEFAULT_SETTINGS);
    setAccount(null);
  }, [account]);

  useEffect(() => {
    if (!account?.deletionScheduledFor) return;
    const timer = setTimeout(finalizeAccountDeletion, Math.max(account.deletionScheduledFor - Date.now(), 0));
    return () => clearTimeout(timer);
  }, [account?.deletionScheduledFor, finalizeAccountDeletion]);

  // Adds a rating only if the user is logged in; new ratings are prepended so
  // the most recent appears first. Anonymous Mode at submit time is recorded.
  const addRating = useCallback(
    (input: NewRatingInput) => {
      if (!account) {
        return;
      }

      ratingIdCounter += 1;
      const newRating: Rating = {
        id: ratingIdCounter,
        userId: account.id,
        spaceId: input.spaceId,
        createdAt: new Date().toISOString(),
        numStars: input.numStars,
        crowdRating: input.crowdRating,
        perceivedNoise: input.perceivedNoise,
        description: input.description ?? '',
        numUpvotes: 0,
      };
      setRatings((prev) => [newRating, ...prev]);
    },
    [account],
  );

  // Increments the helpful count on the matching rating.
  const markHelpful = useCallback((id: number) => {
    setRatings((prev) =>
      prev.map((rating) => (rating.id === id ? { ...rating, numUpvotes: rating.numUpvotes + 1 } : rating)),
    );
  }, []);

  // Removes the rating with the given id, but only if the current user owns it.
  const deleteRating = useCallback(
    (id: number) => {
      if (!account) return;
      setRatings((prev) => prev.filter((rating) => !(rating.id === id && rating.userId === account.id)));
    },
    [calvinEmail],
  );

  const submitSuggestion = useCallback(
    (input: NewSuggestionInput) => {
      if (!account) return 'Log in with your Calvin email to suggest a space.';
      if (hasSuggestedToday(suggestions, account.id)) return 'You can suggest one space per day. Try again tomorrow.';
      const name = input.name.trim();
      if (!name) return 'Please enter a name for the space.';

      suggestionIdCounter += 1;
      const suggestion: SpotSuggestion = {
        id: suggestionIdCounter,
        userId: account?.id ?? 0,
        locationId: 1,
        name,
        description: input.description.trim(),
        type: 'addition',
        createdAt: new Date().toISOString(),
        numUpvotes: 1,
        status: 'beingTested',
      };
      setSuggestions((prev) => [suggestion, ...prev]);
      return null;
    },
    [calvinEmail, suggestions, account],
  );

  const voteOnSuggestion = useCallback(
    (id: number, vote: 1 | -1) => {
      if (!account) return;
      const userId = account.id;
      setSuggestionVotes((prev) => {
        const existing = prev.find((v) => v.suggestionId === id && v.userId === userId);
        // Tapping the same vote again clears it.
        if (existing && existing.vote === vote) {
          return prev.filter((v) => !(v.suggestionId === id && v.userId === userId));
        }
        const next = existing
          ? prev.map((v) => (v.suggestionId === id && v.userId === userId ? { ...v, vote } : v))
          : [...prev, { suggestionId: id, userId, vote, createdAt: new Date().toISOString() }];
        return next;
      });
    },
    [account],
  );

  const locations = useMemo(() => baseLocations, []);

  const spaces = useMemo(() => baseSpaces, []);

  // Adds the space to favorites if absent, or removes it if already present.
  const toggleFavorite = useCallback((space: Space) => {
    setFavorites((prev) => {
      const exists = prev.some((favorite) => favorite.spaceId === space.id);
      if (exists) {
        return prev.filter((favorite) => favorite.spaceId !== space.id);
      }
      return [...prev, { userId: 1, spaceId: space.id, createdAt: new Date().toISOString() }];
    });
  }, []);

  // Removes the favorite with the given space id.
  const removeFavorite = useCallback((spaceId: number) => {
    setFavorites((prev) => prev.filter((favorite) => favorite.spaceId !== spaceId));
  }, []);

  // Whether the given space id is currently favorited.
  const isFavorite = useCallback(
    (spaceId: number) => favorites.some((favorite) => favorite.spaceId === spaceId),
    [favorites],
  );

  // Flips the boolean value of the given setting key.
  const toggleSetting = useCallback((key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const value = useMemo(
    () => ({
      account,
      calvinEmail,
      logIn,
      logOut,
      requestAccountDeletion,
      cancelAccountDeletion,
      finalizeAccountDeletion,
      locations,
      spaces,
      ratings,
      addRating,
      markHelpful,
      deleteRating,
      suggestions,
      suggestionVotes,
      submitSuggestion,
      voteOnSuggestion,
      favorites,
      toggleFavorite,
      removeFavorite,
      isFavorite,
      settings,
      toggleSetting,
    }),
    [
      account,
      calvinEmail,
      logIn,
      logOut,
      requestAccountDeletion,
      cancelAccountDeletion,
      finalizeAccountDeletion,
      locations,
      spaces,
      ratings,
      addRating,
      markHelpful,
      deleteRating,
      suggestions,
      suggestionVotes,
      submitSuggestion,
      voteOnSuggestion,
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
