import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 1, name: 'study' },
  { id: 2, name: 'social' },
  { id: 3, name: 'athletics' },
  { id: 4, name: 'events' },
];

export function getCategoryById(id: number): Category | undefined {
  return categories.find((category) => category.id === id);
}
