import { spaces } from '@/data/spaces';
import { answerSpotQuery, askSpotAgent } from '@/services/spot-agent';

describe('mock spot recommendation agent', () => {
  it('recommends spaces matching every requested attribute and explains why', () => {
    const response = answerSpotQuery('quiet spot', spaces);

    expect(response.exactMatch).toBe(true);
    expect(response.recommendations.length).toBeGreaterThan(0);
    for (const { space, reasons, missing } of response.recommendations) {
      expect(space.currentNoiseLevel === 'whisper' || space.currentNoiseLevel === 'lowBuzz').toBe(true);
      expect(missing).toEqual([]);
      expect(reasons.some((reason) => /noise level/i.test(reason))).toBe(true);
    }
  });

  it('suggests relaxing constraints when nothing matches everything', () => {
    const response = answerSpotQuery('quiet gym with coffee', spaces);

    expect(response.exactMatch).toBe(false);
    expect(response.message).toMatch(/Try relaxing/);
    expect(response.recommendations[0].missing.length).toBeGreaterThan(0);
  });

  it('prompts for more detail when the query has no recognizable needs', () => {
    const response = answerSpotQuery('hello', spaces);

    expect(response.exactMatch).toBe(false);
    expect(response.message).toMatch(/couldn't tell/);
  });

  it('returns at most three exact matches', () => {
    const response = answerSpotQuery('somewhere quiet', spaces);

    expect(response.exactMatch).toBe(true);
    expect(response.recommendations.length).toBeLessThanOrEqual(3);
  });

  it('is case-insensitive and keeps the original query text', () => {
    const response = answerSpotQuery('  QUIET Spot ', spaces);

    expect(response.query).toBe('  QUIET Spot ');
    expect(response.message).toMatch(/quiet/);
  });

  it('handles an empty space list without crashing', () => {
    expect(answerSpotQuery('hello', []).recommendations).toEqual([]);
  });

  it('matches multiple criteria at once (quiet + study)', () => {
    const response = answerSpotQuery('quiet study spot', spaces);
    expect(response.exactMatch).toBe(true);
    for (const { space, reasons } of response.recommendations) {
      expect(space.categoryId).toBe(1);
      expect(space.currentNoiseLevel === 'whisper' || space.currentNoiseLevel === 'lowBuzz').toBe(true);
      expect(reasons.some((reason) => /Built for studying/i.test(reason))).toBe(true);
    }
  });

  it('ranks exact matches by overall rating', () => {
    const response = answerSpotQuery('quiet', spaces);
    const ratings = response.recommendations.map(({ space }) => space.overallRating);
    const sorted = [...ratings].sort((a, b) => b - a);
    expect(ratings).toEqual(sorted);
  });

  it('returns the closest match with missing criteria when nothing is exact', () => {
    // No space is both food/coffee (category 2) and a workout spot (category 3),
    // so nothing matches exactly.
    const response = answerSpotQuery('coffee gym', spaces);
    expect(response.exactMatch).toBe(false);
    expect(response.recommendations.length).toBeGreaterThan(0);
    // Every returned recommendation should still meet at least one criterion.
    for (const { missing } of response.recommendations) {
      expect(missing.length).toBeLessThan(2);
    }
  });

  it('recognizes a "near" a named building from the description', () => {
    const response = answerSpotQuery('somewhere quiet near the greenhouse', spaces);
    expect(response.recommendations.length).toBeGreaterThan(0);
    for (const { space } of response.recommendations) {
      expect(space.description.toLowerCase()).toMatch(/greenhouse/);
    }
  });

  it('falls back to top-rated spots for an unrecognized query', () => {
    const response = answerSpotQuery('zzz nonsense', spaces);
    expect(response.exactMatch).toBe(false);
    expect(response.recommendations.length).toBeGreaterThan(0);
    const ratings = response.recommendations.map(({ space }) => space.overallRating);
    const sorted = [...ratings].sort((a, b) => b - a);
    expect(ratings).toEqual(sorted);
  });
});

describe('askSpotAgent', () => {
  afterEach(() => jest.useRealTimers());

  it('waits for the simulated delay, then resolves with the same answer as answerSpotQuery', async () => {
    jest.useFakeTimers();
    const onResolve = jest.fn();

    const pending = askSpotAgent('quiet', spaces, { delayMs: 500 }).then(onResolve);
    await jest.advanceTimersByTimeAsync(499);
    expect(onResolve).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    await pending;
    expect(onResolve).toHaveBeenCalledWith(answerSpotQuery('quiet', spaces));
  });
});
