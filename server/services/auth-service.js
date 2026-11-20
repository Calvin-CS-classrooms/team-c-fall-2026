// Business logic for creating accounts.
//
// Validates the sign-up form, then asks the data layer to create the user.
// The Supabase data layer emails a confirmation link; for now sign-up is
// mock-only (see data/index.js), so no email is sent. Supabase's
// error codes are turned into messages a student can act on.

const repository = require("../data");
const { AppError } = require("./errors");

const CALVIN_EMAIL = /^[a-z0-9._%+-]+@calvin\.edu$/;
const MIN_PASSWORD_LENGTH = 8;
// Supabase Auth hashes passwords with bcrypt, which ignores anything past 72 bytes.
const MAX_PASSWORD_LENGTH = 72;
const MAX_NAME_LENGTH = 50;

// Supabase Auth error codes -> what to tell the student.
const SUPABASE_ERRORS = {
  weak_password: [400, "That password is too weak. Try a longer one with a mix of letters and numbers.", "password"],
  over_email_send_rate_limit: [429, "Too many sign-up emails were sent recently. Please try again in an hour."],
  // Supabase's built-in email service only sends to the project's own team members.
  email_address_not_authorized: [503, "Sign-up emails can't be sent yet: the project needs a custom SMTP server set up in Supabase."],
  signup_disabled: [503, "New sign-ups are disabled right now."],
};

/**
 * Creates an account and sends a confirmation email.
 *
 * @param {{ firstName?: string, lastName?: string, email?: string, password?: string }} input
 * @returns {Promise<{ email: string, emailSent: boolean }>} The normalized email, and
 *   whether a confirmation email was actually sent (false while sign-up is mock-only).
 * @throws {AppError} 400 for invalid input, 409 if the email already has an
 *   account, and 429/503 for Supabase email limits or settings.
 */
async function createAccount(input) {
  const firstName = typeof input?.firstName === "string" ? input.firstName.trim() : "";
  const lastName = typeof input?.lastName === "string" && input.lastName.trim() ? input.lastName.trim() : null;
  const email = typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input?.password === "string" ? input.password : "";

  if (!firstName) throw new AppError(400, "Please enter your first name.", "firstName");
  if (firstName.length > MAX_NAME_LENGTH) {
    throw new AppError(400, `First name must be ${MAX_NAME_LENGTH} characters or fewer.`, "firstName");
  }
  if (!CALVIN_EMAIL.test(email)) throw new AppError(400, "Please use your @calvin.edu email.", "email");
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, "password");
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new AppError(400, `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`, "password");
  }

  let result;
  try {
    result = await repository.createAuthUser({ email, password, firstName, lastName });
  } catch (err) {
    const known = SUPABASE_ERRORS[err?.code];
    if (known) throw new AppError(...known);
    throw err;
  }

  if (result.alreadyRegistered) {
    throw new AppError(409, "An account with this email already exists. Try logging in instead.", "email");
  }

  return { email, emailSent: Boolean(result.emailSent) };
}

module.exports = { createAccount };
