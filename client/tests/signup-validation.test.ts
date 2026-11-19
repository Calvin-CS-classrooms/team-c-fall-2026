// Tests the sign-up form checks run before anything is sent to the server.
import { validateSignUp, type SignUpForm } from '@/utils/signup-validation';

const valid: SignUpForm = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@calvin.edu',
  password: 'correct horse',
  confirmPassword: 'correct horse',
};

describe('validateSignUp', () => {
  it('has no errors for a complete, valid form', () => {
    expect(validateSignUp(valid)).toEqual({});
  });

  it('allows a missing last name', () => {
    expect(validateSignUp({ ...valid, lastName: '' })).toEqual({});
  });

  it('accepts a Calvin email with spaces or capitals', () => {
    expect(validateSignUp({ ...valid, email: '  Jane.Doe@Calvin.EDU ' })).toEqual({});
  });

  it.each([
    ['firstName', { firstName: '   ' }, /first name/i],
    ['firstName', { firstName: 'J'.repeat(51) }, /50/],
    ['email', { email: 'jane@gmail.com' }, /@calvin\.edu/],
    ['email', { email: '' }, /@calvin\.edu/],
    ['password', { password: 'short', confirmPassword: 'short' }, /at least 8/],
    ['password', { password: 'p'.repeat(73), confirmPassword: 'p'.repeat(73) }, /72/],
    ['confirmPassword', { confirmPassword: 'different' }, /match/i],
  ])('flags %s', (field, change, message) => {
    expect(validateSignUp({ ...valid, ...change })).toEqual({ [field]: expect.stringMatching(message) });
  });

  it('reports every problem at once', () => {
    const errors = validateSignUp({ firstName: '', lastName: '', email: 'x', password: '1', confirmPassword: '2' });

    expect(Object.keys(errors).sort()).toEqual(['confirmPassword', 'email', 'firstName', 'password']);
  });
});
