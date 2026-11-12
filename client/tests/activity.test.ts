import { activityFeed } from '@/data/activity';
import type { NoiseLevel } from '@/types';

const NOISE_LEVELS: NoiseLevel[] = ['whisper', 'lowBuzz', 'social', 'loud'];

describe('activity feed mock data', () => {
  it('has unique ids and non-empty messages', () => {
    const ids = activityFeed.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of activityFeed) {
      expect(item.message.length).toBeGreaterThan(0);
      expect(item.locationName.length).toBeGreaterThan(0);
    }
  });

  it('uses only valid noise levels and non-negative ages', () => {
    for (const item of activityFeed) {
      expect(NOISE_LEVELS).toContain(item.noise);
      expect(item.minutesAgo).toBeGreaterThanOrEqual(0);
    }
  });

  it('is sorted from most recent to oldest', () => {
    const ages = activityFeed.map((item) => item.minutesAgo);
    const sorted = [...ages].sort((a, b) => a - b);
    expect(ages).toEqual(sorted);
  });

  it('only includes waitMinutes when a wait is reported', () => {
    for (const item of activityFeed) {
      if (item.waitMinutes !== undefined) {
        expect(item.waitMinutes).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
