import { formatDate, formatMinutesAgo, getKnightTier } from '@/utils/format';

describe('formatMinutesAgo', () => {
  it('formats minutes, hours, and days', () => {
    expect(formatMinutesAgo(0)).toBe('just now');
    expect(formatMinutesAgo(12)).toBe('12 min ago');
    expect(formatMinutesAgo(60)).toBe('1 hr ago');
    expect(formatMinutesAgo(120)).toBe('2 hrs ago');
    expect(formatMinutesAgo(1440)).toBe('1 day ago');
  });

  it('switches units at the 1-minute, 60-minute, and 24-hour boundaries', () => {
    expect(formatMinutesAgo(0.5)).toBe('just now');
    expect(formatMinutesAgo(1)).toBe('1 min ago');
    expect(formatMinutesAgo(59)).toBe('59 min ago');
    expect(formatMinutesAgo(60)).toBe('1 hr ago');
  });

  it('rounds to the nearest hour and day', () => {
    expect(formatMinutesAgo(89)).toBe('1 hr ago');
    expect(formatMinutesAgo(90)).toBe('2 hrs ago');
    // 23h59m rounds up to 24 hours, which is reported as a day.
    expect(formatMinutesAgo(1439)).toBe('1 day ago');
    expect(formatMinutesAgo(2 * 1440)).toBe('2 days ago');
  });
});

describe('formatDate', () => {
  it('includes the day of the month for a timestamp', () => {
    const formatted = formatDate(new Date(2026, 10, 18, 12, 0).getTime());

    expect(typeof formatted).toBe('string');
    expect(formatted).toMatch(/18/);
  });

  it('does not include the year', () => {
    expect(formatDate(new Date(2026, 10, 18, 12, 0).getTime())).not.toMatch(/2026/);
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

  it('promotes exactly at each tier threshold', () => {
    expect(getKnightTier(4).label).toBe('Page');
    expect(getKnightTier(5).label).toBe('Squire');
    expect(getKnightTier(14).label).toBe('Squire');
    expect(getKnightTier(30)).toEqual({ label: 'Grand Knight', progress: 1 });
  });

  it('keeps progress between 0 and 1', () => {
    for (const count of [0, 3, 7, 22, 29, 100]) {
      const { progress } = getKnightTier(count);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
    }
  });
});
