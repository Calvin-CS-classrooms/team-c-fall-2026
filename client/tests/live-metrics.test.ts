// Tests recalculating a space's rating, crowd level, and noise level as
// ratings are added and deleted after the app loads.
import type { Rating, Space } from '@/types';
import { withLiveMetrics } from '@/utils/live-metrics';

function space(overrides: Partial<Space> = {}): Space {
  return {
    id: 1,
    locationId: 1,
    categoryId: 1,
    floorId: 1,
    name: 'Space',
    description: '',
    noiseLevel: 'lowBuzz',
    spotSuggestionId: null,
    overallRating: 4,
    crowdRating: 40,
    currentNoiseLevel: 'lowBuzz',
    ...overrides,
  };
}

let nextId = 1;
function rating(overrides: Partial<Rating> = {}): Rating {
  return {
    id: nextId++,
    userId: 1,
    spaceId: 1,
    createdAt: '2026-11-13T12:00:00.000Z',
    numStars: 4,
    crowdRating: 50,
    perceivedNoise: 'lowBuzz',
    description: '',
    numUpvotes: 0,
    ...overrides,
  };
}

describe('withLiveMetrics', () => {
  it('leaves spaces unchanged when no ratings were added or deleted', () => {
    const loaded = [rating({ numStars: 4 })];
    const [result] = withLiveMetrics([space()], loaded, loaded);

    expect(result).toMatchObject({ overallRating: 4, crowdRating: 40, currentNoiseLevel: 'lowBuzz' });
  });

  it('gives the exact new average when the loaded rating came from loaded ratings', () => {
    // Like server data: 4.5 is the average of the loaded 5 and 4.
    const loaded = [rating({ numStars: 5 }), rating({ numStars: 4 })];
    const added = rating({ numStars: 3 });

    const [result] = withLiveMetrics([space({ overallRating: 4.5 })], loaded, [...loaded, added]);

    expect(result.overallRating).toBe(4); // (5 + 4 + 3) / 3
  });

  it('counts a starting rating with no ratings behind it as one rating', () => {
    // Like bundled data: a seeded 4.6 with no loaded ratings.
    const added = rating({ numStars: 5 });

    const [result] = withLiveMetrics([space({ overallRating: 4.6 })], [], [added]);

    expect(result.overallRating).toBe(4.8); // (4.6 + 5) / 2
  });

  it('recalculates after a loaded rating is deleted', () => {
    const five = rating({ numStars: 5 });
    const four = rating({ numStars: 4 });

    const [result] = withLiveMetrics([space({ overallRating: 4.5 })], [five, four], [four]);

    expect(result.overallRating).toBe(4);
  });

  it('goes back to the starting value when an added rating is deleted', () => {
    const loaded = [rating({ numStars: 4 })];

    const [result] = withLiveMetrics([space({ overallRating: 4 })], loaded, loaded);

    expect(result.overallRating).toBe(4);
  });

  it('is 0 when the only rating is deleted', () => {
    const only = rating({ numStars: 5 });

    const [result] = withLiveMetrics([space({ overallRating: 5 })], [only], []);

    expect(result.overallRating).toBe(0);
  });

  it('rounds to one decimal', () => {
    const loaded = [rating({ numStars: 5 }), rating({ numStars: 5 })];

    const [result] = withLiveMetrics([space({ overallRating: 5 })], loaded, [...loaded, rating({ numStars: 4 })]);

    expect(result.overallRating).toBe(4.7); // 14 / 3 = 4.67
  });

  it('takes crowd level and noise from the newest added rating', () => {
    const older = rating({ createdAt: '2026-11-13T12:00:00.000Z', crowdRating: 10, perceivedNoise: 'whisper' });
    const newer = rating({ createdAt: '2026-11-13T12:30:00.000Z', crowdRating: 90, perceivedNoise: 'loud' });

    const [result] = withLiveMetrics([space()], [], [newer, older]);

    expect(result).toMatchObject({ crowdRating: 90, currentNoiseLevel: 'loud' });
  });

  it('keeps the loaded crowd level and noise until someone adds a rating', () => {
    const loaded = [rating({ crowdRating: 99, perceivedNoise: 'loud' })];

    const [result] = withLiveMetrics([space({ crowdRating: 40, currentNoiseLevel: 'lowBuzz' })], loaded, loaded);

    expect(result).toMatchObject({ crowdRating: 40, currentNoiseLevel: 'lowBuzz' });
  });

  it('only changes the space that was rated', () => {
    const added = rating({ spaceId: 2, numStars: 1 });

    const [first, second] = withLiveMetrics(
      [space({ id: 1, overallRating: 4 }), space({ id: 2, overallRating: 4 })],
      [],
      [added],
    );

    expect(first.overallRating).toBe(4);
    expect(second.overallRating).toBe(2.5);
  });
});
