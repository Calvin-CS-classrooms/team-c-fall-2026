// Tests loading campus data from the REST API with a mocked fetch.
//
// The important rule: locations, spaces, and ratings must come from the same
// source. The server's ids do not match the bundled data's ids, so mixing them
// (e.g. server locations with bundled spaces) attaches spaces and ratings to the
// wrong buildings. loadCampusData is therefore all-or-nothing.
import type { ApiLocation, ApiSpace } from '@/services/campus-api';
import type { Location, Rating, Space } from '@/types';

type CampusModules = {
  api: typeof import('@/services/campus-api');
  locations: typeof import('@/data/locations');
  spaces: typeof import('@/data/spaces');
  ratings: typeof import('@/data/ratings');
};

// The data modules hold module-level state, so each test gets fresh copies.
function loadModules(): CampusModules {
  let modules!: CampusModules;
  jest.isolateModules(() => {
    modules = {
      api: require('@/services/campus-api'),
      locations: require('@/data/locations'),
      spaces: require('@/data/spaces'),
      ratings: require('@/data/ratings'),
    };
  });
  return modules;
}

const serverSpace = (overrides: Partial<ApiSpace> = {}): ApiSpace => ({
  id: 101,
  locationId: 50,
  categoryId: 1,
  floorId: 7,
  name: 'Server Quiet Floor',
  description: 'From the server',
  noiseLevel: 'whisper',
  spotSuggestionId: null,
  overallRating: 4.5,
  crowdRating: 20,
  currentNoiseLevel: 'lowBuzz',
  ...overrides,
});

const serverLocation = (overrides: Partial<ApiLocation> = {}): ApiLocation => ({
  id: 50,
  name: 'Server Hall',
  image: 'north-hall',
  description: 'From the server',
  numFloors: 1,
  numSpaces: 1,
  hours: { openingTime: '07:00', closingTime: '22:00' },
  floors: [{ id: 7, locationId: 50, name: 'Main', noiseLevel: 'whisper' }],
  spaces: [serverSpace()],
  ...overrides,
});

const serverRating = (overrides: Partial<Rating> = {}): Rating => ({
  id: 900,
  userId: 3,
  spaceId: 101,
  createdAt: '2026-11-12T12:00:00.000Z',
  numStars: 5,
  crowdRating: 20,
  perceivedNoise: 'whisper',
  description: 'Server rating',
  numUpvotes: 2,
  ...overrides,
});

type Route = { body?: unknown; ok?: boolean; status?: number; fail?: Error };

// Fakes fetch per path, e.g. { '/api/locations': { body: [...] } }.
function mockServer(routes: Record<string, Route>) {
  const fetchMock = jest.fn(async (url: string) => {
    const path = Object.keys(routes).find((route) => url.endsWith(route));
    const route = path ? routes[path] : { ok: false, status: 404 };
    if (route.fail) throw route.fail;
    return {
      ok: route.ok ?? true,
      status: route.status ?? 200,
      json: () => Promise.resolve(route.body),
    };
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

const originalFetch = globalThis.fetch;

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('fetchRatings', () => {
  it('requests /api/ratings and returns the rows', async () => {
    const { api } = loadModules();
    const fetchMock = mockServer({ '/api/ratings': { body: [serverRating()] } });

    await expect(api.fetchRatings()).resolves.toEqual([serverRating()]);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/ratings$/);
  });

  it('throws with the status code on a server error', async () => {
    const { api } = loadModules();
    mockServer({ '/api/ratings': { ok: false, status: 500 } });

    await expect(api.fetchRatings()).rejects.toThrow('API returned 500');
  });
});

describe('spacesFromLocations', () => {
  it('flattens the spaces nested in each location', () => {
    const { api } = loadModules();
    const locations = [
      serverLocation({ id: 1, spaces: [serverSpace({ id: 1, locationId: 1 }), serverSpace({ id: 2, locationId: 1 })] }),
      serverLocation({ id: 2, spaces: [serverSpace({ id: 3, locationId: 2 })] }),
    ];

    expect(api.spacesFromLocations(locations).map((space: Space) => space.id)).toEqual([1, 2, 3]);
  });

  it('uses the typical noise level when an unrated space has no current noise level', () => {
    const { api } = loadModules();
    const [space] = api.spacesFromLocations([
      serverLocation({ spaces: [serverSpace({ noiseLevel: 'social', currentNoiseLevel: null })] }),
    ]);

    expect(space.currentNoiseLevel).toBe('social');
  });

  it('keeps the current noise level when the space has ratings', () => {
    const { api } = loadModules();
    const [space] = api.spacesFromLocations([serverLocation()]);

    expect(space.currentNoiseLevel).toBe('lowBuzz');
  });

  it('turns an image URL into an image source and drops a missing image', () => {
    const { api } = loadModules();
    const [withImage, withoutImage] = api.spacesFromLocations([
      serverLocation({
        spaces: [serverSpace({ id: 1, image: 'https://example.com/a.jpg' }), serverSpace({ id: 2, image: null })],
      }),
    ]);

    expect(withImage.image).toEqual({ uri: 'https://example.com/a.jpg' });
    expect(withoutImage.image).toBeUndefined();
  });

  it('handles a location without a spaces array', () => {
    const { api } = loadModules();
    const { spaces: _omit, ...bare } = serverLocation();

    expect(api.spacesFromLocations([bare])).toEqual([]);
  });
});

describe('loadCampusData', () => {
  it('replaces locations, spaces, and ratings together when the server answers', async () => {
    const modules = loadModules();
    mockServer({
      '/api/locations': { body: [serverLocation()] },
      '/api/ratings': { body: [serverRating()] },
    });

    await expect(modules.api.loadCampusData()).resolves.toBe('server');

    expect(modules.locations.locations.map((location: Location) => location.name)).toEqual(['Server Hall']);
    expect(modules.spaces.spaces.map((space: Space) => space.id)).toEqual([101]);
    expect(modules.spaces.getSpaceById(101)?.name).toBe('Server Quiet Floor');
    expect(modules.ratings.initialRatings).toEqual([serverRating()]);
  });

  it('does not keep the nested floors and spaces on stored locations', async () => {
    const modules = loadModules();
    mockServer({
      '/api/locations': { body: [serverLocation()] },
      '/api/ratings': { body: [] },
    });

    await modules.api.loadCampusData();

    expect(modules.locations.locations[0]).not.toHaveProperty('spaces');
    expect(modules.locations.locations[0]).not.toHaveProperty('floors');
  });

  it('keeps all bundled data when the ratings request fails', async () => {
    const modules = loadModules();
    const bundled = {
      locations: modules.locations.locations,
      spaces: modules.spaces.spaces,
      ratings: modules.ratings.initialRatings,
    };
    mockServer({
      '/api/locations': { body: [serverLocation()] },
      '/api/ratings': { ok: false, status: 500 },
    });

    await expect(modules.api.loadCampusData()).resolves.toBe('bundled');

    expect(modules.locations.locations).toBe(bundled.locations);
    expect(modules.spaces.spaces).toBe(bundled.spaces);
    expect(modules.ratings.initialRatings).toBe(bundled.ratings);
  });

  it('keeps all bundled data when the server is unreachable', async () => {
    const modules = loadModules();
    const bundledSpaces = modules.spaces.spaces;
    mockServer({
      '/api/locations': { fail: new TypeError('Network request failed') },
      '/api/ratings': { fail: new TypeError('Network request failed') },
    });

    await expect(modules.api.loadCampusData()).resolves.toBe('bundled');
    expect(modules.spaces.spaces).toBe(bundledSpaces);
    expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/Network request failed/));
  });
});
