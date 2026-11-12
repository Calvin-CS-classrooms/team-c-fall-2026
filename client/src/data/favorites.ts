import type { Favorites } from '@/types';

export const initialFavorites: Favorites[] = [
  { userId: 1, spaceId: 4, createdAt: new Date().toISOString() },
  { userId: 1, spaceId: 20, createdAt: new Date().toISOString() },
];
