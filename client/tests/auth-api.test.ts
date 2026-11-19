// Tests createAccount, which posts the sign-up form to the server, with a
// mocked fetch.
import { ApiError } from '@/services/api-client';
import { createAccount } from '@/services/auth-api';

const input = { firstName: 'Jane', lastName: 'Doe', email: 'jane@calvin.edu', password: 'correct horse' };

function mockResponse(status: number, body: unknown) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('createAccount', () => {
  it('POSTs the form as JSON to /api/auth/signup', async () => {
    const fetchMock = mockResponse(201, { email: 'jane@calvin.edu', message: 'Check jane@calvin.edu' });

    await createAccount(input);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/auth\/signup$/);
    expect(options).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    );
  });

  it("returns the server's email and message", async () => {
    mockResponse(201, { email: 'jane@calvin.edu', message: 'Check jane@calvin.edu for a link.' });

    await expect(createAccount(input)).resolves.toEqual({
      email: 'jane@calvin.edu',
      message: 'Check jane@calvin.edu for a link.',
    });
  });

  it("throws the server's error message and field", async () => {
    mockResponse(409, { error: 'An account with this email already exists.', field: 'email' });

    const error = await createAccount(input).catch((caught) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, field: 'email', message: 'An account with this email already exists.' });
  });

  it('uses a generic message when the error response has no message', async () => {
    mockResponse(500, {});

    await expect(createAccount(input)).rejects.toMatchObject({ status: 500, message: 'API returned 500' });
  });

  it('explains when the server cannot be reached', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;

    await expect(createAccount(input)).rejects.toMatchObject({
      status: 0,
      message: expect.stringMatching(/can't reach the server/i),
    });
  });
});
