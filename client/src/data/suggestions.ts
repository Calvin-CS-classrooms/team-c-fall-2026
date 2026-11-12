import type { SpotSuggestion } from '@/types';

const HOUR = 60 * 60 * 1000;

// Mock votes from other students so the promotion flow can be demoed in a single-user prototype.
export function createInitialSuggestions(now = Date.now()): SpotSuggestion[] {
  return [
    {
      id: 1,
      userId: 1,
      locationId: 1,
      name: 'Science Building Atrium',
      description: 'Open atrium with tables between lecture halls.',
      type: 'addition',
      createdAt: new Date(now - 30 * HOUR).toISOString(),
      numUpvotes: 4,
      status: 'beingTested',
    },
    {
      id: 2,
      userId: 3,
      locationId: 4,
      name: 'Chapel Lower Lounge',
      description: 'Couches and a few tables below the chapel.',
      type: 'addition',
      createdAt: new Date(now - 5 * HOUR).toISOString(),
      numUpvotes: 2,
      status: 'beingTested',
    },
  ];
}
