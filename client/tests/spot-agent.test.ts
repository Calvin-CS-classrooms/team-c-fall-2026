import { locations } from '@/data/locations';
import { answerSpotQuery } from '@/services/spot-agent';

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
});
