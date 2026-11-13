import type { User } from '@/types';

// Mock user data (mirrors the users table). Used to show who wrote each
// rating. User 1 is the account you sign in as in this prototype.
export const users: User[] = [
  {
    id: 1,
    firstName: 'Emma',
    lastName: 'Kuipers',
    email: 'emma.k@calvin.edu',
    createdAt: '2026-09-01T12:00:00.000Z',
    isVerified: true,
    isAnonymous: false,
    hasLocationAccess: false,
    numRatings: 1,
    allowsNotifications: true,
  },
  {
    id: 2,
    firstName: 'Noah',
    lastName: 'De Vries',
    email: 'noah.d@calvin.edu',
    createdAt: '2026-09-02T12:00:00.000Z',
    isVerified: true,
    isAnonymous: false,
    hasLocationAccess: true,
    numRatings: 1,
    allowsNotifications: false,
  },
  {
    id: 3,
    firstName: 'Grace',
    lastName: null,
    email: 'grace.v@calvin.edu',
    createdAt: '2026-09-03T12:00:00.000Z',
    isVerified: true,
    isAnonymous: true,
    hasLocationAccess: false,
    numRatings: 1,
    allowsNotifications: true,
  },
  {
    id: 4,
    firstName: 'Sam',
    lastName: 'Bosma',
    email: 'sam.b@calvin.edu',
    createdAt: '2026-09-04T12:00:00.000Z',
    isVerified: true,
    isAnonymous: false,
    hasLocationAccess: false,
    numRatings: 1,
    allowsNotifications: true,
  },
];

export function getUserById(id: number): User | undefined {
  return users.find((user) => user.id === id);
}
