import type { ImageSourcePropType } from 'react-native';

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
  image: ImageSourcePropType;
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
