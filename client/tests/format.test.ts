import { formatMinutesAgo, getKnightTier } from '@/utils/format';

describe('formatMinutesAgo', () => {
  it('formats minutes, hours, and days', () => {
    expect(formatMinutesAgo(0)).toBe('just now');
    expect(formatMinutesAgo(12)).toBe('12 min ago');
    expect(formatMinutesAgo(60)).toBe('1 hr ago');
    expect(formatMinutesAgo(120)).toBe('2 hrs ago');
    expect(formatMinutesAgo(1440)).toBe('1 day ago');
  });
});

describe('getKnightTier', () => {
  it('calculates the current tier and progress to the next tier', () => {
    expect(getKnightTier(0)).toEqual({ label: 'Page', next: 'Squire', progress: 0 });
    expect(getKnightTier(10)).toEqual({ label: 'Squire', next: 'Knight', progress: 0.5 });
    expect(getKnightTier(15)).toEqual({ label: 'Knight', next: 'Grand Knight', progress: 0 });
  });

  it('caps progress at the highest tier', () => {
    expect(getKnightTier(40)).toEqual({ label: 'Grand Knight', progress: 1 });
  });
});
