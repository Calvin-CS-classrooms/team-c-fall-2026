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
