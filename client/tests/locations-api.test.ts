// Tests the locations API client with a mocked fetch, so no server is needed:
// image mapping, HTTP errors, network failures, and the request timeout that
// lets the app fall back to bundled data.
import { fetchLocations } from '@/services/locations-api';

const apiLocation = (id: string, imageKey: string) => ({
  id,
  name: id,
  category: 'study',
  imageKey,
  capacity: 10,
  density: 'quiet',
  noise: 'whisper',
  hoursLabel: 'Open',
  isOpenNow: true,
  rating: 4,
  shortDescription: 'Test location',
  amenities: [],
  floors: [],
});

function mockFetchResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: () => Promise.resolve(body),
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  jest.useRealTimers();
});

describe('fetchLocations', () => {
  it('requests /api/locations with an abort signal', async () => {
    const fetchMock = mockFetchResponse([]);

    await fetchLocations();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/locations$/);
    expect(options.signal).toBeDefined();
  });

  it('replaces imageKey with a local image and keeps the other fields', async () => {
    mockFetchResponse([apiLocation('north-hall', 'north-hall')]);

    const [location] = await fetchLocations();

    expect(location).not.toHaveProperty('imageKey');
    expect(location.image).toBeDefined();
    expect(location.id).toBe('north-hall');
    expect(location.rating).toBe(4);
  });

  it('maps different imageKeys to different images', async () => {
    mockFetchResponse([apiLocation('a', 'north-hall'), apiLocation('b', 'peets-coffee')]);

    const [first, second] = await fetchLocations();

    expect(first.image).not.toEqual(second.image);
  });

  it('falls back to the Hekman Library image for an unknown imageKey', async () => {
    mockFetchResponse([apiLocation('mystery', 'does-not-exist'), apiLocation('hekman', 'hekman_library')]);

    const [unknown, hekman] = await fetchLocations();

    expect(unknown.image).toEqual(hekman.image);
  });

  it('returns an empty list when the server has no locations', async () => {
    mockFetchResponse([]);
    await expect(fetchLocations()).resolves.toEqual([]);
  });

  it('throws with the status code when the server responds with an error', async () => {
    mockFetchResponse({ error: 'boom' }, { ok: false, status: 500 });
    await expect(fetchLocations()).rejects.toThrow('API returned 500');
  });

  it('rejects when the network request fails', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed')) as unknown as typeof fetch;
    await expect(fetchLocations()).rejects.toThrow('Network request failed');
  });

  it('aborts the request after 3 seconds so the app can fall back to bundled data', async () => {
    jest.useFakeTimers();
    let receivedSignal: AbortSignal | undefined;
    // A fetch that never answers on its own and only settles when aborted.
    globalThis.fetch = jest.fn((_url: string, options: { signal: AbortSignal }) => {
      receivedSignal = options.signal;
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('Aborted')));
      });
    }) as unknown as typeof fetch;

    const pending = fetchLocations();
    jest.advanceTimersByTime(2999);
    expect(receivedSignal?.aborted).toBe(false);

    jest.advanceTimersByTime(1);
    await expect(pending).rejects.toThrow('Aborted');
    expect(receivedSignal?.aborted).toBe(true);
  });
});
