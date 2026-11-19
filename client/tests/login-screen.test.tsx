// Tests the link from Log In to Create account.
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { AppProvider } from '@/context/app-context';
import { LoginScreen } from '@/screens/login-screen';

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) };
jest.mock('expo-router', () => ({ useRouter: () => mockRouter }));

const SAFE_AREA = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

describe('LoginScreen', () => {
  it('has a Create account link under Log In that opens the sign-up screen', async () => {
    let renderer!: ReactTestRenderer;
    // The screen's icons load their font asynchronously. Rendering inside an
    // async act lets that finish while the test is still running; otherwise the
    // icons update after Jest has torn down and the run fails.
    await act(async () => {
      renderer = create(
        <SafeAreaProvider initialMetrics={SAFE_AREA}>
          <AppProvider>
            <LoginScreen />
          </AppProvider>
        </SafeAreaProvider>,
      );
    });

    const link = renderer.root.find(
      (node) => node.props.accessibilityRole === 'link' && typeof node.props.onPress === 'function',
    );
    act(() => link.props.onPress());

    expect(link.props.accessibilityLabel).toBe('New here? Create an account');
    expect(mockRouter.push).toHaveBeenCalledWith('/signup');

    act(() => renderer.unmount());
  });
});
