export type TabType = 'home' | 'explore' | 'ratings' | 'profile';

export type CategoryType = 'all' | 'study' | 'dining' | 'events' | 'athletics' | 'chapel';

export type NoiseLevelType = 'Whisper Quiet' | 'Quiet Study Focus' | 'Lively Social' | 'Loud / Energetic';

export interface FloorInfo {
  floor: string;
  name: string;
  noise: string;
  capacity: number;
  openSeats: number;
}

export interface Place {
  id: string;
  name: string;
  category: 'study' | 'dining' | 'events' | 'athletics' | 'chapel';
  subLocation: string;
  hours: string;
  distance: string;
  rating: number;
  reviewCount: number;
  busyLevel: number;
  busyLabel: string;
  busyStatus: 'quiet' | 'moderate' | 'busy';
  waitTime?: string;
  image: string;
  studentGuide: string;
  noiseLevel: string;
  amenityHighlights: string;
  tags: string[];
  floors?: FloorInfo[];
  isFavorite: boolean;
  specialBadge?: string;
}

export interface UserRating {
  id: string;
  placeId: string;
  placeName: string;
  subLocation: string;
  timeAgo: string;
  rating: number;
  capacityPercent: number;
  noiseLevel: string;
  tags: string[];
  comment: string;
  helpfulVotes: number;
  hasVotedHelpful?: boolean;
}

export interface UserProfile {
  name: string;
  classYear: string;
  major: string;
  email: string;
  studentId: string;
  ssoVerified: boolean;
  ratingsCount: number;
  helpfulVotesCount: number;
  tier: string;
  accuracyRate: number;
  avatarUrl: string;
  privacy: {
    geolocation: boolean;
    anonymousMode: boolean;
    capacityAlerts: boolean;
  };
}
