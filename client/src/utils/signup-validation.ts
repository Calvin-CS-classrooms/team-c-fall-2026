// Checks for the Create account form. They mirror the server's rules
// (server/services/auth-service.js) so most mistakes are caught before
// anything is sent; the server checks again.

export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignUpErrors = Partial<Record<keyof SignUpForm, string>>;

const CALVIN_EMAIL = /^[a-z0-9._%+-]+@calvin\.edu$/;
export const MIN_PASSWORD_LENGTH = 8;
// Supabase Auth hashes passwords with bcrypt, which ignores anything past 72 bytes.
const MAX_PASSWORD_LENGTH = 72;
const MAX_NAME_LENGTH = 50;

/** Returns a message for each field that needs fixing; an empty object means the form is valid. */
export function validateSignUp(form: SignUpForm): SignUpErrors {
  const errors: SignUpErrors = {};
  const firstName = form.firstName.trim();

  if (!firstName) errors.firstName = 'Please enter your first name.';
  else if (firstName.length > MAX_NAME_LENGTH) errors.firstName = `First name must be ${MAX_NAME_LENGTH} characters or fewer.`;

  if (!CALVIN_EMAIL.test(form.email.trim().toLowerCase())) errors.email = 'Please use your @calvin.edu email.';

  if (form.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  } else if (form.password.length > MAX_PASSWORD_LENGTH) {
    errors.password = `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  }
  // Checked separately so every problem is shown at once.
  if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords don't match.";

  return errors;
}
