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
import { createInitialSuggestions } from '@/data/suggestions';
import type {
  Account,
  AmenityVote,
  AppSettings,
  CampusLocation,
  FavoriteSpot,
  NewRatingInput,
  NewSuggestionInput,
  SpaceSuggestion,
  SuggestionVote,
  UserRating,
} from '@/types';
import { computeLocationRating } from '@/utils/ratings';
import { hasSuggestedToday, netScore, PROMOTION_THRESHOLD, suggestionToLocation } from '@/utils/suggestions';
import { isCalvinEmail } from '@/utils/verification';

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
  locations: CampusLocation[];
  ratings: UserRating[];
  addRating: (input: NewRatingInput) => void;
  markHelpful: (id: string) => void;
  deleteRating: (id: string) => void;
  suggestions: SpaceSuggestion[];
  submitSuggestion: (input: NewSuggestionInput) => string | null;
  voteOnSuggestion: (id: string, vote: SuggestionVote) => void;
  voteOnAmenity: (id: string, amenity: string, vote: AmenityVote) => void;
  proposeAmenity: (id: string, amenity: string) => void;
  favorites: FavoriteSpot[];
  toggleFavorite: (location: CampusLocation) => void;
  removeFavorite: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
  settings: AppSettings;
  toggleSetting: (key: keyof AppSettings) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Module-level counters used to generate unique ids for locally created
// ratings and suggestions (there is no backend yet).
let ratingIdCounter = 0;
let suggestionIdCounter = 0;
let deletedUserCounter = 0;

/** "jane.doe@calvin.edu" -> "Jane Doe" */
export function nameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function rekeyVotes<T>(votes: Record<string, T>, from: string, to: string): Record<string, T> {
  if (!(from in votes)) return votes;
  const { [from]: value, ...rest } = votes;
  return { ...rest, [to]: value };
}

/**
 * Provides all app-wide state (account, ratings, suggestions, favorites,
 * settings) to the component tree via context. Acts as a client-only stand-in
 * for a backend: state lives in memory and is seeded from mock data.
 */
export function AppProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<Account | null>(null);
  const [ratings, setRatings] = useState<UserRating[]>(initialRatings);
  const [suggestions, setSuggestions] = useState<SpaceSuggestion[]>(() => createInitialSuggestions());
  const [favorites, setFavorites] = useState<FavoriteSpot[]>(initialFavorites);
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
    const email = account.email;
    deletedUserCounter += 1;
    const placeholder = `deleted-user-${deletedUserCounter}`;

    setRatings((prev) =>
      prev.map((rating) =>
        rating.ownerEmail === email ? { ...rating, ownerEmail: null, ownerName: undefined, isAnonymous: true } : rating,
      ),
    );
    setSuggestions((prev) =>
      prev.map((suggestion) => ({
        ...suggestion,
        submittedBy: suggestion.submittedBy === email ? null : suggestion.submittedBy,
        votes: rekeyVotes(suggestion.votes, email, placeholder),
        amenities: suggestion.amenities.map((amenity) => ({
          ...amenity,
          votes: rekeyVotes(amenity.votes, email, placeholder),
        })),
      })),
    );
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
      const newRating: UserRating = {
        id: `local-rating-${ratingIdCounter}`,
        helpfulCount: 0,
        createdMinutesAgo: 0,
        ownerEmail: account.email,
        ownerName: account.name,
        isAnonymous: settings.anonymousMode,
        ...input,
      };
      setRatings((prev) => [newRating, ...prev]);
    },
    [account, settings.anonymousMode],
  );

  // Increments the helpful count on the matching rating.
  const markHelpful = useCallback((id: string) => {
    setRatings((prev) =>
      prev.map((rating) => (rating.id === id ? { ...rating, helpfulCount: rating.helpfulCount + 1 } : rating)),
    );
  }, []);

  // Removes the rating with the given id, but only if the current user owns it.
  const deleteRating = useCallback(
    (id: string) => {
      if (!calvinEmail) return;
      setRatings((prev) => prev.filter((rating) => !(rating.id === id && rating.ownerEmail === calvinEmail)));
    },
    [calvinEmail],
  );

  const submitSuggestion = useCallback(
    (input: NewSuggestionInput) => {
      if (!calvinEmail) return 'Log in with your Calvin email to suggest a space.';
      if (hasSuggestedToday(suggestions, calvinEmail)) return 'You can suggest one space per day. Try again tomorrow.';
      const name = input.name.trim();
      if (!name) return 'Please enter a name for the space.';

      suggestionIdCounter += 1;
      const amenityNames = [...new Set(input.amenities.map((amenity) => amenity.trim()).filter(Boolean))];
      const suggestion: SpaceSuggestion = {
        id: `local-suggestion-${suggestionIdCounter}`,
        name,
        description: input.description.trim(),
        usage: input.usage.trim(),
        amenities: amenityNames.map((amenity) => ({ name: amenity, votes: { [calvinEmail]: 'keep' } })),
        submittedBy: calvinEmail,
        submittedAt: Date.now(),
        votes: { [calvinEmail]: 1 },
        status: 'pending',
      };
      setSuggestions((prev) => [suggestion, ...prev]);
      return null;
    },
    [calvinEmail, suggestions],
  );

  const voteOnSuggestion = useCallback(
    (id: string, vote: SuggestionVote) => {
      if (!calvinEmail) return;
      setSuggestions((prev) =>
        prev.map((suggestion) => {
          if (suggestion.id !== id || suggestion.status !== 'pending' || suggestion.submittedBy === calvinEmail) {
            return suggestion;
          }
          const votes = { ...suggestion.votes };
          // Tapping the same vote again clears it.
          if (votes[calvinEmail] === vote) delete votes[calvinEmail];
          else votes[calvinEmail] = vote;
          const next = { ...suggestion, votes };
          return netScore(next) >= PROMOTION_THRESHOLD ? { ...next, status: 'official' } : next;
        }),
      );
    },
    [calvinEmail],
  );

  const voteOnAmenity = useCallback(
    (id: string, amenityName: string, vote: AmenityVote) => {
      if (!calvinEmail) return;
      setSuggestions((prev) =>
        prev.map((suggestion) =>
          suggestion.id !== id || suggestion.status !== 'pending'
            ? suggestion
            : {
                ...suggestion,
                amenities: suggestion.amenities.map((amenity) => {
                  if (amenity.name !== amenityName) return amenity;
                  const votes = { ...amenity.votes };
                  if (votes[calvinEmail] === vote) delete votes[calvinEmail];
                  else votes[calvinEmail] = vote;
                  return { ...amenity, votes };
                }),
              },
        ),
      );
    },
    [calvinEmail],
  );

  const proposeAmenity = useCallback(
    (id: string, amenityName: string) => {
      const name = amenityName.trim();
      if (!calvinEmail || !name) return;
      setSuggestions((prev) =>
        prev.map((suggestion) => {
          if (suggestion.id !== id || suggestion.status !== 'pending') return suggestion;
          if (suggestion.amenities.some((amenity) => amenity.name.toLowerCase() === name.toLowerCase())) {
            return suggestion;
          }
          return { ...suggestion, amenities: [...suggestion.amenities, { name, votes: { [calvinEmail]: 'keep' } }] };
        }),
      );
    },
    [calvinEmail],
  );

  const locations = useMemo(() => {
    const official = suggestions.filter((suggestion) => suggestion.status === 'official').map(suggestionToLocation);
    return [...baseLocations, ...official].map((location) => ({
      ...location,
      rating: computeLocationRating(
        location.rating,
        ratings.filter((rating) => rating.locationId === location.id).map((rating) => rating.stars),
      ),
    }));
  }, [ratings, suggestions]);

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
      account,
      calvinEmail,
      logIn,
      logOut,
      requestAccountDeletion,
      cancelAccountDeletion,
      finalizeAccountDeletion,
      locations,
      ratings,
      addRating,
      markHelpful,
      deleteRating,
      suggestions,
      submitSuggestion,
      voteOnSuggestion,
      voteOnAmenity,
      proposeAmenity,
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
      ratings,
      addRating,
      markHelpful,
      deleteRating,
      suggestions,
      submitSuggestion,
      voteOnSuggestion,
      voteOnAmenity,
      proposeAmenity,
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
