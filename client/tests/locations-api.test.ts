// Tests the locations API client with a mocked fetch, so no server is needed:
// HTTP errors, network failures, and the request timeout that lets the app
// fall back to bundled data.
import { fetchLocations } from '@/services/locations-api';

const apiLocation = (id: number, name: string) => ({
  id,
  name,
  image: `https://example.com/${name}.jpg`,
  description: 'Test location',
  numFloors: 2,
  numSpaces: 10,
  hours: { openingTime: '07:00', closingTime: '22:00' },
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

  it('returns the locations from the server', async () => {
    mockFetchResponse([apiLocation(1, 'north-hall')]);

    const [location] = await fetchLocations();

    expect(location.id).toBe(1);
    expect(location.name).toBe('north-hall');
    expect(location.image).toBe('https://example.com/north-hall.jpg');
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

  it('clears the timeout once the response arrives', async () => {
    jest.useFakeTimers();
    mockFetchResponse([]);
    const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout');

    const pending = fetchLocations();
    await jest.advanceTimersByTimeAsync(0);
    await pending;

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('throws when the response body is not valid JSON', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.reject(new SyntaxError('Unexpected token')),
    }) as unknown as typeof fetch;

    await expect(fetchLocations()).rejects.toThrow('Unexpected token');
  });
});
