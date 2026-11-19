// Shared HTTP helper for talking to the Express REST API.

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Give up quickly when the server isn't running so the app can fall back to bundled data.
const REQUEST_TIMEOUT_MS = 3000;

/**
 * GETs `path` (e.g. "/api/ratings") from the API server and parses the JSON body.
 *
 * Rejects when the request takes longer than 3 seconds (the request is
 * aborted), when the network fails, when the server answers with a non-2xx
 * status ("API returned 500"), or when the body is not valid JSON.
 */
export async function fetchJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { signal: controller.signal });
  } finally {
    // The timeout only guards the connection; once headers arrive it is no longer needed.
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }

  return (await response.json()) as T;
}

/** An error response from the API, carrying the server's message and, when given, the form field it is about. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Sending a confirmation email can take a few seconds, so allow longer than GETs.
const POST_TIMEOUT_MS = 15000;

/**
 * POSTs `body` as JSON to `path` and parses the JSON response.
 *
 * @throws ApiError with the server's `error` message and `field` for a
 *   non-2xx response ("API returned 500" if it gave no message), or with
 *   status 0 when the server can't be reached or doesn't answer in time.
 */
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), POST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Make sure it's running, then try again.");
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? `API returned ${response.status}`, data?.field);
  }
  return data as T;
}
