// Tests grouping spaces into one entry per building (location) for the home
// screen carousel and the Explore directory.
import type { Location, Space } from '@/types';
import { groupSpacesByBuilding, summarizeBuilding } from '@/utils/buildings';

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
    crowdRating: 50,
    currentNoiseLevel: 'lowBuzz',
    ...overrides,
  };
}

function location(id: number, name = `Building ${id}`): Location {
  return {
    id,
    name,
    image: undefined,
    description: '',
    numFloors: 1,
    numSpaces: 1,
    hours: { openingTime: '07:00', closingTime: '22:00' },
  };
}

describe('summarizeBuilding', () => {
  it('averages the rating and crowd level of rated spaces', () => {
    const summary = summarizeBuilding([
      space({ overallRating: 5, crowdRating: 20 }),
      space({ overallRating: 4, crowdRating: 60 }),
    ]);

    expect(summary).toEqual({ overallRating: 4.5, crowdRating: 40 });
  });

  it('rounds the rating to one decimal and the crowd level to a whole percent', () => {
    const summary = summarizeBuilding([
      space({ overallRating: 4.6, crowdRating: 50 }),
      space({ overallRating: 4.7, crowdRating: 40 }),
      space({ overallRating: 4.5, crowdRating: 61 }),
    ]);

    expect(summary.overallRating).toBe(4.6);
    expect(summary.crowdRating).toBe(50);
  });

  it('ignores unrated spaces so they do not drag the building down', () => {
    const summary = summarizeBuilding([
      space({ overallRating: 5, crowdRating: 30 }),
      space({ overallRating: 0, crowdRating: 0 }),
    ]);

    expect(summary).toEqual({ overallRating: 5, crowdRating: 30 });
  });

  it('is zero for a building with no rated spaces', () => {
    expect(summarizeBuilding([space({ overallRating: 0, crowdRating: 0 })])).toEqual({
      overallRating: 0,
      crowdRating: 0,
    });
  });

  it('is zero for a building with no spaces', () => {
    expect(summarizeBuilding([])).toEqual({ overallRating: 0, crowdRating: 0 });
  });
});

describe('groupSpacesByBuilding', () => {
  const buildings = [location(1, 'Library'), location(2, 'Gym')];
  const findLocation = (id: number) => buildings.find((building) => building.id === id);

  it('returns one entry per building with its spaces', () => {
    const groups = groupSpacesByBuilding(
      [space({ id: 1, locationId: 1 }), space({ id: 2, locationId: 2 }), space({ id: 3, locationId: 1 })],
      findLocation,
    );

    expect(groups.map((group) => group.location.name)).toEqual(['Library', 'Gym']);
    expect(groups[0].spaces.map((s) => s.id)).toEqual([1, 3]);
    expect(groups[1].spaces.map((s) => s.id)).toEqual([2]);
  });

  it('orders buildings by their first space, keeping trending order', () => {
    const groups = groupSpacesByBuilding(
      [space({ id: 9, locationId: 2 }), space({ id: 1, locationId: 1 })],
      findLocation,
    );

    expect(groups.map((group) => group.location.id)).toEqual([2, 1]);
  });

  it('includes each building summary', () => {
    const [library] = groupSpacesByBuilding(
      [
        space({ locationId: 1, overallRating: 5, crowdRating: 20 }),
        space({ id: 2, locationId: 1, overallRating: 3, crowdRating: 40 }),
      ],
      findLocation,
    );

    expect(library.overallRating).toBe(4);
    expect(library.crowdRating).toBe(30);
  });

  it('skips spaces whose building is unknown', () => {
    const groups = groupSpacesByBuilding([space({ locationId: 99 })], findLocation);

    expect(groups).toEqual([]);
  });

  it('returns an empty list when no spaces match', () => {
    expect(groupSpacesByBuilding([], findLocation)).toEqual([]);
  });
});
