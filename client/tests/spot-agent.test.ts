import { locations } from '@/data/locations';
import { answerSpotQuery, askSpotAgent } from '@/services/spot-agent';

describe('mock spot recommendation agent', () => {
  it('recommends locations matching every requested attribute and explains why', () => {
    const response = answerSpotQuery('quiet spot with power outlets', locations);

    expect(response.exactMatch).toBe(true);
    expect(response.recommendations.length).toBeGreaterThan(0);
    for (const { location, reasons, missing } of response.recommendations) {
      expect(location.amenities.some((amenity) => /outlet/i.test(amenity))).toBe(true);
      expect(missing).toEqual([]);
      expect(reasons).toContain('Has power outlets');
    }
  });

  it('suggests relaxing constraints when nothing matches everything', () => {
    const response = answerSpotQuery('quiet gym with outlets and coffee', locations);

    expect(response.exactMatch).toBe(false);
    expect(response.message).toMatch(/Try relaxing/);
    expect(response.recommendations[0].missing.length).toBeGreaterThan(0);
  });

  it('prompts for more detail when the query has no recognizable needs', () => {
    const response = answerSpotQuery('hello', locations);

    expect(response.exactMatch).toBe(false);
    expect(response.message).toMatch(/couldn't tell/);
  });

  it('understands "near" a named building', () => {
    const response = answerSpotQuery('somewhere quiet near the library', locations);

    expect(response.recommendations[0].location.id).toBe('hekman-library');
  });

  it('returns at most three exact matches', () => {
    const response = answerSpotQuery('somewhere with wifi', locations);

    expect(response.exactMatch).toBe(true);
    expect(response.recommendations.length).toBeLessThanOrEqual(3);
  });

  it('is case-insensitive and keeps the original query text', () => {
    const response = answerSpotQuery('  QUIET Spot With OUTLETS ', locations);

    expect(response.query).toBe('  QUIET Spot With OUTLETS ');
    expect(response.message).toMatch(/quiet/);
    expect(response.message).toMatch(/power outlets/);
  });

  it('suggests the silent floor when asked for a quiet spot', () => {
    const hekmanOnly = locations.filter((location) => location.id === 'hekman-library');
    const [hekman] = answerSpotQuery('quiet place to study', hekmanOnly).recommendations;

    expect(hekman.suggestedFloor).toMatch(/Silent/);
    // Without a quiet request there is no floor suggestion.
    expect(answerSpotQuery('somewhere to study', hekmanOnly).recommendations[0].suggestedFloor).toBeUndefined();
  });

  it('only recommends open locations in the fallback answer', () => {
    const response = answerSpotQuery('hello', locations);

    expect(response.recommendations.length).toBeGreaterThan(0);
    for (const entry of response.recommendations) {
      expect(entry.location.isOpenNow).toBe(true);
    }
  });

  it('handles an empty location list without crashing', () => {
    expect(answerSpotQuery('hello', []).recommendations).toEqual([]);
  });
});

describe('askSpotAgent', () => {
  afterEach(() => jest.useRealTimers());

  it('waits for the simulated delay, then resolves with the same answer as answerSpotQuery', async () => {
    jest.useFakeTimers();
    const onResolve = jest.fn();

    const pending = askSpotAgent('quiet with outlets', locations, { delayMs: 500 }).then(onResolve);
    await jest.advanceTimersByTimeAsync(499);
    expect(onResolve).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    await pending;
    expect(onResolve).toHaveBeenCalledWith(answerSpotQuery('quiet with outlets', locations));
  });
});
