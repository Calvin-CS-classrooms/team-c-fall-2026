// Account requests to the Express server, which creates the account in
// Supabase Auth and emails a confirmation link.

import { postJson } from '@/services/api-client';

export interface CreateAccountInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateAccountResult {
  /** The email the confirmation link was sent to. */
  email: string;
  message: string;
}

/**
 * Creates an account. The student must click the link in the confirmation
 * email before the account is active.
 *
 * @throws ApiError with a message to show, e.g. for an email that already
 *   has an account (409) or when the server can't be reached (status 0).
 */
export function createAccount(input: CreateAccountInput): Promise<CreateAccountResult> {
  return postJson<CreateAccountResult>('/api/auth/signup', input);
}
