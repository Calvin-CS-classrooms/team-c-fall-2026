// Tests the Create account screen with the API call and router mocked.
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { ApiError } from '@/services/api-client';
import { createAccount } from '@/services/auth-api';
import { SignUpScreen } from '@/screens/signup-screen';

jest.mock('@/services/auth-api', () => ({ createAccount: jest.fn() }));

const mockRouter = { back: jest.fn(), canGoBack: jest.fn(() => true), replace: jest.fn(), push: jest.fn() };
jest.mock('expo-router', () => ({ useRouter: () => mockRouter }));

const mockCreateAccount = createAccount as jest.MockedFunction<typeof createAccount>;

const SAFE_AREA = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function render() {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <SafeAreaProvider initialMetrics={SAFE_AREA}>
        <SignUpScreen />
      </SafeAreaProvider>,
    );
  });
  return renderer;
}

function type(renderer: ReactTestRenderer, testID: string, value: string) {
  act(() => renderer.root.findByProps({ testID }).props.onChangeText(value));
}

function fillValidForm(renderer: ReactTestRenderer) {
  type(renderer, 'signup-first-name', 'Jane');
  type(renderer, 'signup-last-name', 'Doe');
  type(renderer, 'signup-email', 'Jane.Doe@calvin.edu');
  type(renderer, 'signup-password', 'correct horse');
  type(renderer, 'signup-confirm-password', 'correct horse');
}

async function press(renderer: ReactTestRenderer, label: string) {
  const button = renderer.root.find(
    (node) =>
      typeof node.props.onPress === 'function' &&
      node.findAll((child) => child.props.children === label).length > 0,
  );
  await act(async () => {
    await button.props.onPress();
  });
}

function screenText(renderer: ReactTestRenderer) {
  return renderer.root
    .findAll((node) => typeof node.props.children === 'string')
    .map((node) => node.props.children as string)
    .join('\n');
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignUpScreen', () => {
  it('shows what to fix and does not contact the server when the form is incomplete', async () => {
    const renderer = render();

    await press(renderer, 'Create Account');

    const text = screenText(renderer);
    expect(text).toMatch(/enter your first name/i);
    expect(text).toMatch(/@calvin\.edu/);
    expect(text).toMatch(/at least 8/);
    expect(mockCreateAccount).not.toHaveBeenCalled();
  });

  it('creates the account and asks the student to check their email', async () => {
    mockCreateAccount.mockResolvedValue({ email: 'jane.doe@calvin.edu', message: 'Check jane.doe@calvin.edu' });
    const renderer = render();
    fillValidForm(renderer);

    await press(renderer, 'Create Account');

    expect(mockCreateAccount).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@calvin.edu',
      password: 'correct horse',
    });
    const text = screenText(renderer);
    expect(text).toMatch(/check your email/i);
    expect(text).toContain('jane.doe@calvin.edu');
  });

  it("shows the server's message next to the right field", async () => {
    mockCreateAccount.mockRejectedValue(new ApiError(409, 'An account with this email already exists.', 'email'));
    const renderer = render();
    fillValidForm(renderer);

    await press(renderer, 'Create Account');

    expect(screenText(renderer)).toContain('An account with this email already exists.');
    expect(screenText(renderer)).not.toMatch(/check your email/i);
  });

  it('shows a general error when the server cannot be reached', async () => {
    mockCreateAccount.mockRejectedValue(new ApiError(0, "Can't reach the server."));
    const renderer = render();
    fillValidForm(renderer);

    await press(renderer, 'Create Account');

    expect(screenText(renderer)).toContain("Can't reach the server.");
  });

  it('goes back to Log In from the link and after signing up', async () => {
    mockCreateAccount.mockResolvedValue({ email: 'jane.doe@calvin.edu', message: '' });
    const renderer = render();

    await press(renderer, 'Already have an account? Log in');
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');

    fillValidForm(renderer);
    await press(renderer, 'Create Account');
    await press(renderer, 'Back to Log In');
    expect(mockRouter.replace).toHaveBeenCalledTimes(2);
  });
});
