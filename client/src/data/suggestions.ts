import type { SpaceSuggestion } from '@/types';

const HOUR = 60 * 60 * 1000;

// Mock votes from other students so the promotion flow can be demoed in a single-user prototype.
export function createInitialSuggestions(now = Date.now()): SpaceSuggestion[] {
  return [
    {
      id: 'suggestion-science-atrium',
      name: 'Science Building Atrium',
      description: 'Open atrium with tables between lecture halls.',
      usage: 'Usually used for quick study sessions between labs and lectures.',
      amenities: [
        { name: 'Outlets', votes: { 'emma.k@calvin.edu': 'keep', 'noah.d@calvin.edu': 'keep' } },
        { name: 'Natural Light', votes: { 'emma.k@calvin.edu': 'keep' } },
        { name: 'Vending Machines', votes: { 'grace.v@calvin.edu': 'remove', 'noah.d@calvin.edu': 'remove' } },
      ],
      submittedBy: 'emma.k@calvin.edu',
      submittedAt: now - 30 * HOUR,
      votes: {
        'emma.k@calvin.edu': 1,
        'noah.d@calvin.edu': 1,
        'grace.v@calvin.edu': 1,
        'sam.b@calvin.edu': 1,
        'ava.r@calvin.edu': 1,
        'liam.t@calvin.edu': -1,
      },
      status: 'pending',
    },
    {
      id: 'suggestion-chapel-lounge',
      name: 'Chapel Lower Lounge',
      description: 'Couches and a few tables below the chapel.',
      usage: 'Mostly used for quiet reading and small group meetings.',
      amenities: [
        { name: 'Couches', votes: { 'grace.v@calvin.edu': 'keep' } },
        { name: 'Wi-Fi', votes: { 'grace.v@calvin.edu': 'keep' } },
      ],
      submittedBy: 'grace.v@calvin.edu',
      submittedAt: now - 5 * HOUR,
      votes: { 'grace.v@calvin.edu': 1, 'sam.b@calvin.edu': 1 },
      status: 'pending',
    },
  ];
}
