import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { initialFavorites } from '@/data/favorites';
import { locations as baseLocations } from '@/data/locations';
import { initialRatings } from '@/data/ratings';
import { spaces as baseSpaces } from '@/data/spaces';
import { createInitialSuggestions } from '@/data/suggestions';
import {
  createFavorite,
  createSpotSuggestion,
  deleteFavorite,
  deleteRating as deleteServerRating,
  fetchUserByEmail,
  submitRating,
  updateUser,
} from '@/services/campus-api';
import type {
  AppSettings,
  Favorites,
  Location,
  NewRatingInput,
  NewSuggestionInput,
  Rating,
  Space,
  SpotSuggestion,
  SuggestionVote,
  User,
} from '@/types';
import { isCalvinEmail } from '@/utils/verification';
import { hasSuggestedToday } from '@/utils/suggestions';
import { withLiveMetrics } from '@/utils/live-metrics';

export const ACCOUNT_DELETION_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

export const MIN_PASSWORD_LENGTH = 6;

const DEFAULT_SETTINGS: AppSettings = {
  geolocation: true,
  anonymousMode: false,
  capacityAlerts: true,
};

interface AppContextValue {
  account: User | null;
  /** The verified Calvin email of the signed-in account, or null when there is no verified account. */
  calvinEmail: string | null;
  logIn: (email: string, password: string) => Promise<string | null>;
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
  /** Message for a failed server sync, or null when there is none. */
  serverError: string | null;
  /** Dismisses the current server error message. */
  clearServerError: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Module-level counter used to generate unique ids for locally created
// suggestions (there is no write endpoint yet). It starts above the highest
// seeded id so locally created rows never collide with mock data.
let suggestionIdCounter = Math.max(0, ...createInitialSuggestions().map((suggestion) => suggestion.id));

/** "jane.doe@calvin.edu" -> ["Jane", "Doe"] (first and last name parts). */
export function namePartsFromEmail(email: string): [string, string | null] {
  const parts = email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1));
  return [parts[0] ?? '', parts[1] ?? null];
}

/** "jane.doe@calvin.edu" -> "Jane Doe" */
export function nameFromEmail(email: string): string {
  return namePartsFromEmail(email).filter(Boolean).join(' ');
}

/**
 * Provides all app-wide state (account, ratings, suggestions, favorites,
 * settings) to the component tree via context. Acts as a client-only stand-in
 * for a backend: state lives in memory and is seeded from mock data.
 */
export function AppProvider({ children, serverAvailable = false }: PropsWithChildren & { serverAvailable?: boolean }) {
  const [account, setAccount] = useState<User | null>(null);
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  // The ratings as loaded, kept so live metrics can tell what changed since.
  const [loadedRatings] = useState<Rating[]>(initialRatings);
  // Next id for a locally created rating. Read from initialRatings at mount, not
  // at import, because loadCampusData may replace them with the server's
  // ratings (and higher ids) after this module is loaded.
  const ratingIdCounter = useRef(Math.max(0, ...initialRatings.map((rating) => rating.id)));
  const [suggestions, setSuggestions] = useState<SpotSuggestion[]>(() => createInitialSuggestions());
  const [suggestionVotes, setSuggestionVotes] = useState<SuggestionVote[]>([]);
  const [favorites, setFavorites] = useState<Favorites[]>(initialFavorites);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  // Message shown to the user when a server sync fails and a change is reverted.
  const [serverError, setServerError] = useState<string | null>(null);

  const calvinEmail = account?.email ?? null;

  const clearServerError = useCallback(() => setServerError(null), []);

  // Sign-in: any verified Calvin email with a long-enough password is accepted.
  // When the server is available, the account must exist there before access is
  // granted, and the real user's data (id, name, etc.) is used. Passwords are
  // never stored; real authentication needs a backend.
  const logIn = useCallback(
    async (email: string, password: string) => {
      if (!isCalvinEmail(email)) return 'Please enter a valid @calvin.edu email.';
      if (password.length < MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (serverAvailable) {
        try {
          const user = await fetchUserByEmail(normalizedEmail);
          setAccount({ ...user, deletionScheduledFor: user.deletionScheduledFor ?? null });
          return null;
        } catch (error) {
          console.warn('Failed to look up account on server:', error);
          return 'No account found for that email. Please check your email or sign up.';
        }
      }

      // Offline fallback: build a mock user from the email.
      const [firstName, lastName] = namePartsFromEmail(normalizedEmail);
      setAccount({
        id: 1,
        firstName,
        lastName,
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
        isVerified: true,
        isAnonymous: false,
        hasLocationAccess: false,
        numRatings: 0,
        allowsNotifications: true,
        deletionScheduledFor: null,
      });
      return null;
    },
    [serverAvailable],
  );

  const logOut = useCallback(() => setAccount(null), []);

  const requestAccountDeletion = useCallback(() => {
    setAccount((prev) =>
      prev ? { ...prev, deletionScheduledFor: new Date(Date.now() + ACCOUNT_DELETION_DELAY_MS).toISOString() } : prev,
    );
  }, []);

  const cancelAccountDeletion = useCallback(() => {
    setAccount((prev) => (prev ? { ...prev, deletionScheduledFor: null } : prev));
  }, []);

  // Permanently removes account information. Ratings stay, but lose their owner and show as anonymous.
  const finalizeAccountDeletion = useCallback(() => {
    if (!account) return;
    // Keep the ratings, but hide who wrote them.
    setRatings((prev) =>
      prev.map((rating) => (rating.userId === account.id ? { ...rating, isAnonymous: true } : rating)),
    );
    setFavorites([]);
    setSettings(DEFAULT_SETTINGS);
    setAccount(null);
  }, [account]);

  useEffect(() => {
    if (!account?.deletionScheduledFor) return;
    const delay = new Date(account.deletionScheduledFor).getTime() - Date.now();
    const timer = setTimeout(finalizeAccountDeletion, Math.max(delay, 0));
    return () => clearTimeout(timer);
  }, [account?.deletionScheduledFor, finalizeAccountDeletion]);

  // Adds a rating only if the user is logged in; new ratings are prepended so
  // the most recent appears first. Anonymous Mode at submit time is recorded.
  // The local state updates immediately (assume it worked); if the server sync
  // fails, the rating is removed again and the user is notified.
  const addRating = useCallback(
    (input: NewRatingInput) => {
      if (!account) {
        return;
      }

      ratingIdCounter.current += 1;
      const newRating: Rating = {
        id: ratingIdCounter.current,
        userId: account.id,
        spaceId: input.spaceId,
        createdAt: new Date().toISOString(),
        numStars: input.numStars,
        crowdRating: input.crowdRating,
        perceivedNoise: input.perceivedNoise,
        description: input.description ?? '',
        numUpvotes: 0,
        isAnonymous: settings.anonymousMode,
      };
      setRatings((prev) => [newRating, ...prev]);

      if (serverAvailable) {
        submitRating({
          ...input,
          userId: account.id,
          createdAt: newRating.createdAt,
          numUpvotes: 0,
        }).catch((error) => {
          // Revert the optimistic add and tell the user.
          setRatings((prev) => prev.filter((rating) => rating.id !== newRating.id));
          setServerError('Your rating could not be saved. Please try again.');
          console.warn('Failed to sync rating to server:', error);
        });
      }
    },
    [account, settings.anonymousMode, serverAvailable],
  );

  // Increments the helpful count on the matching rating.
  const markHelpful = useCallback((id: number) => {
    setRatings((prev) =>
      prev.map((rating) => (rating.id === id ? { ...rating, numUpvotes: rating.numUpvotes + 1 } : rating)),
    );
  }, []);

  // Removes the rating with the given id, but only if the current user owns it.
  // The local state updates immediately (assume it worked); if the server sync
  // fails, the rating is restored and the user is notified.
  const deleteRating = useCallback(
    (id: number) => {
      if (!account) return;
      const removed = ratings.find((rating) => rating.id === id && rating.userId === account.id);
      setRatings((prev) => prev.filter((rating) => !(rating.id === id && rating.userId === account.id)));

      if (serverAvailable && removed) {
        deleteServerRating(id).catch((error) => {
          // Revert the optimistic delete and tell the user.
          setRatings((prev) =>
            [...prev, removed].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
          );
          setServerError('Your rating could not be deleted. Please try again.');
          console.warn('Failed to sync rating deletion to server:', error);
        });
      }
    },
    [account, ratings, serverAvailable],
  );

  const locations = useMemo(() => baseLocations, []);

  const submitSuggestion = useCallback(
    (input: NewSuggestionInput) => {
      if (!account) return 'Log in with your Calvin email to suggest a space.';
      if (hasSuggestedToday(suggestions, account.id)) return 'You can suggest one space per day. Try again tomorrow.';
      const name = input.name.trim();
      if (!name) return 'Please enter a name for the space.';

      // The suggestion form doesn't collect a location, so attach it to the
      // first loaded location (a valid id is required by the DB foreign key).
      const locationId = locations[0]?.id ?? 1;

      suggestionIdCounter += 1;
      const suggestion: SpotSuggestion = {
        id: suggestionIdCounter,
        userId: account?.id ?? 0,
        locationId,
        name,
        description: input.description.trim(),
        type: 'addition',
        createdAt: new Date().toISOString(),
        numUpvotes: 1,
        status: 'beingTested',
      };
      setSuggestions((prev) => [suggestion, ...prev]);

      if (serverAvailable) {
        createSpotSuggestion({
          userId: account.id,
          locationId,
          name,
          description: input.description.trim(),
          type: 'addition',
          createdAt: suggestion.createdAt,
          numUpvotes: suggestion.numUpvotes,
          status: suggestion.status,
        }).catch((error) => {
          // Revert the optimistic add and tell the user.
          setSuggestions((prev) => prev.filter((entry) => entry.id !== suggestion.id));
          setServerError('Your suggestion could not be saved. Please try again.');
          console.warn('Failed to sync suggestion to server:', error);
        });
      }

      return null;
    },
    [suggestions, account, serverAvailable, locations],
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

  // Spaces with their rating, crowd level, and noise kept in step with ratings
  // added or deleted since the app loaded (see utils/live-metrics.ts).
  const spaces = useMemo(() => withLiveMetrics(baseSpaces, loadedRatings, ratings), [loadedRatings, ratings]);

  // Adds the space to favorites if absent, or removes it if already present.
  // The local state updates immediately (assume it worked); if the server sync
  // fails, the change is reverted and the user is notified.
  const toggleFavorite = useCallback(
    (space: Space) => {
      const wasFavorite = favorites.some((favorite) => favorite.spaceId === space.id);
      const previousFavorites = favorites;

      setFavorites((prev) => {
        if (wasFavorite) {
          return prev.filter((favorite) => favorite.spaceId !== space.id);
        }
        return [
          ...prev,
          { userId: account?.id ?? 1, spaceId: space.id, createdAt: new Date().toISOString() },
        ];
      });

      if (serverAvailable && account) {
        const request = wasFavorite
          ? deleteFavorite(account.id, space.id)
          : createFavorite({
              userId: account.id,
              spaceId: space.id,
              createdAt: new Date().toISOString(),
            });
        request.catch((error) => {
          // Revert the optimistic change and tell the user.
          setFavorites(previousFavorites);
          setServerError(
            wasFavorite
              ? 'Your favorite could not be removed. Please try again.'
              : 'Your favorite could not be saved. Please try again.',
          );
          console.warn('Failed to sync favorite to server:', error);
        });
      }
    },
    [account, favorites, serverAvailable],
  );

  // Removes the favorite with the given space id.
  // The local state updates immediately (assume it worked); if the server sync
  // fails, the favorite is restored and the user is notified.
  const removeFavorite = useCallback(
    (spaceId: number) => {
      const removed = favorites.find((favorite) => favorite.spaceId === spaceId);
      setFavorites((prev) => prev.filter((favorite) => favorite.spaceId !== spaceId));

      if (serverAvailable && account && removed) {
        deleteFavorite(account.id, spaceId).catch((error) => {
          // Revert the optimistic delete and tell the user.
          setFavorites((prev) => [...prev, removed]);
          setServerError('Your favorite could not be removed. Please try again.');
          console.warn('Failed to sync favorite deletion to server:', error);
        });
      }
    },
    [account, favorites, serverAvailable],
  );

  // Whether the given space id is currently favorited.
  const isFavorite = useCallback(
    (spaceId: number) => favorites.some((favorite) => favorite.spaceId === spaceId),
    [favorites],
  );

  // Flips the boolean value of the given setting key. The local state updates
  // immediately (assume it worked); if the server sync fails, the setting is
  // reverted and the user is notified.
  const toggleSetting = useCallback(
    (key: keyof AppSettings) => {
      const previousSettings = settings;
      const nextValue = !settings[key];
      setSettings((prev) => ({ ...prev, [key]: nextValue }));

      if (serverAvailable && account) {
        // Map the client setting to the matching users-table column.
        const column =
          key === 'anonymousMode' ? 'isAnonymous' : key === 'capacityAlerts' ? 'allowsNotifications' : null;
        if (column) {
          updateUser(account.id, { [column]: nextValue }).catch((error) => {
            // Revert the optimistic change and tell the user.
            setSettings(previousSettings);
            setServerError('Your preference could not be saved. Please try again.');
            console.warn('Failed to sync preference to server:', error);
          });
        }
      }
    },
    [account, serverAvailable, settings],
  );

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
      serverError,
      clearServerError,
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
      serverError,
      clearServerError,
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
