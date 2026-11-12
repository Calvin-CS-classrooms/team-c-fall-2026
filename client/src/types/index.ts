// ===== Main table interfaces (camelCase mapping of the DB schema) =====

import type { ImageProps } from 'expo-image';

export type NoiseLevel = 'whisper' | 'lowBuzz' | 'social' | 'loud';
export type DensityLevel = 'quiet' | 'moderate' | 'busy';
export type AmenityVote = 'keep' | 'remove';


export interface User {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  createdAt: string; // TIMESTAMPTZ
  isVerified: boolean;
  isAnonymous: boolean;
  hasLocationAccess: boolean;
  numRatings: number;
  allowsNotifications: boolean;
}

export interface LocationHours {
  openingTime: string;
  closingTime: string;
}

export interface Location {
  id: number;
  name: string;
  image: ImageProps['source']; // bundled asset or URL
  description: string;
  numFloors: number;
  numSpaces: number;
  hours: LocationHours; // later sourced from Google hours
}

export interface Space {
  id: number;
  locationId: number;
  categoryId: number;
  floorId: number;
  name: string;
  description: string;
  /** General/expected noise level of the area (DB column). */
  noiseLevel: NoiseLevel;
  spotSuggestionId: number | null;
  // Derived from ratings of this space:
  overallRating: number;
  crowdRating: number;
  /** Current noise level, derived from ratings of this space. */
  currentNoiseLevel: NoiseLevel;
}

export interface Rating {
  id: number;
  userId: number;
  spaceId: number;
  createdAt: string;
  numStars: number;
  crowdRating: number;
  perceivedNoise: NoiseLevel;
  description: string;
  numUpvotes: number;
}

export interface Amenity {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

/** Composite-key join table: amenities available at a space. */
export interface SpaceAmenity {
  spaceId: number;
  amenityId: number;
}

export interface SpotSuggestion {
  id: number;
  userId: number;
  locationId: number;
  name: string;
  description: string;
  type: 'addition' | 'removal';
  createdAt: string;
  numUpvotes: number;
  status: 'processed' | 'beingTested' | 'approved' | 'rejected';
}

export interface Notification {
  id: number;
  userId: number;
  spaceId: number;
  createdAt: string;
  message: string;
  type: 'openSpot' | 'suggestionApproved' | 'systemNotification';
  isRead: boolean;
}

export interface Floor {
  id: number;
  locationId: number;
  name: string | null;
  noiseLevel: NoiseLevel;
}

/** Composite-key join table: a user's favorite spaces. */
export interface Favorites {
  userId: number;
  spaceId: number;
  createdAt: string;
}

/** Composite-key join table: a user's vote on a space suggestion. */
export interface SuggestionVote {
  suggestionId: number;
  userId: number;
  vote: 1 | -1;
  createdAt: string;
}

// ===== Kept legacy types (not DB tables) =====

export interface ActivityFeedItem {
  id: string;
  locationId: string;
  locationName: string;
  message: string;
  noise: NoiseLevel;
  waitMinutes?: number;
  minutesAgo: number;
}

export interface UserRating {
  id: string;
  locationId: string;
  locationName: string;
  stars: number;
  capacity: number;
  noise: NoiseLevel;
  amenities: string[];
  comment?: string;
  helpfulCount: number;
  createdMinutesAgo: number;
  /** Internal owner reference. Kept for anonymous ratings, cleared when the account is deleted. */
  ownerEmail: string | null;
  ownerName?: string;
  isAnonymous: boolean;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  createdAt: number;
  /** Epoch ms when the account will be permanently deleted, or null if no deletion is pending. */
  deletionScheduledFor: number | null;
}


export interface SuggestedAmenity {
  name: string;
  votes: Record<string, AmenityVote>;
}

export interface NewSuggestionInput {
  name: string;
  description: string;
  usage: string;
  amenities: string[];
}

export interface NewRatingInput {
  spaceId: number;
  numStars: number;
  crowdRating: number;
  perceivedNoise: NoiseLevel;
  description?: string;
}

export interface AppSettings {
  geolocation: boolean;
  anonymousMode: boolean;
  capacityAlerts: boolean;
}


export interface FloorGuide {
  floor: string;
  description: string;
  noise: NoiseLevel;
}
