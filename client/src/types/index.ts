import type { ImageProps } from 'expo-image';

export type Category = 'study' | 'dining' | 'athletics' | 'events';

export type DensityLevel = 'quiet' | 'moderate' | 'busy';

export type NoiseLevel = 'whisper' | 'low-buzz' | 'social' | 'loud';

export interface FloorGuide {
  floor: string;
  description: string;
  noise: NoiseLevel;
}

export interface CampusLocation {
  id: string;
  name: string;
  category: Category;
  image: ImageProps['source'];
  capacity: number;
  density: DensityLevel;
  noise: NoiseLevel;
  hoursLabel: string;
  isOpenNow: boolean;
  rating: number;
  waitTimeMinutes?: number;
  shortDescription: string;
  amenities: string[];
  floors: FloorGuide[];
}

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
  name: string;
  email: string;
  createdAt: number;
  /** Epoch ms when the account will be permanently deleted, or null if no deletion is pending. */
  deletionScheduledFor: number | null;
}

export type SuggestionVote = 1 | -1;

export type AmenityVote = 'keep' | 'remove';

export interface SuggestedAmenity {
  name: string;
  votes: Record<string, AmenityVote>;
}

export interface SpaceSuggestion {
  id: string;
  name: string;
  description: string;
  usage: string;
  amenities: SuggestedAmenity[];
  submittedBy: string | null;
  submittedAt: number;
  votes: Record<string, SuggestionVote>;
  status: 'pending' | 'official';
}

export interface NewSuggestionInput {
  name: string;
  description: string;
  usage: string;
  amenities: string[];
}

export interface NewRatingInput {
  locationId: string;
  locationName: string;
  stars: number;
  capacity: number;
  noise: NoiseLevel;
  amenities: string[];
  comment?: string;
}

export interface FavoriteSpot {
  locationId: string;
  name: string;
  category: Category;
}

export interface AppSettings {
  geolocation: boolean;
  anonymousMode: boolean;
  capacityAlerts: boolean;
}
