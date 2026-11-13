// Presses the Back button on the building detail and Suggestions screens, with
// and without a previous screen, using a mocked expo-router.
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { AppProvider } from '@/context/app-context';
import { LocationDetailScreen } from '@/screens/location-detail-screen';
import { SuggestionsScreen } from '@/screens/suggestions-screen';

const mockRouter = {
  canGoBack: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
};

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => mockRouter,
}));

// Fixed phone-sized metrics so safe-area hooks work outside a real device.
const SAFE_AREA = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function render(screen: React.ReactElement) {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <SafeAreaProvider initialMetrics={SAFE_AREA}>
        <AppProvider>{screen}</AppProvider>
      </SafeAreaProvider>,
    );
  });
  return renderer;
}

// The Back button is the pressable element whose text is "Back".
function pressBack(renderer: ReactTestRenderer) {
  const button = renderer.root.find(
    (node) =>
      typeof node.props.onPress === 'function' &&
      node.findAll((child) => child.props.children === 'Back').length > 0,
  );
  if (!button) throw new Error('Back button not found');
  act(() => button.props.onPress());
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe.each([
  ['building detail', <LocationDetailScreen key="detail" />, '/'],
  ['Suggestions', <SuggestionsScreen key="suggestions" />, '/explore'],
])('%s Back button', (_name, screen, fallback) => {
  it('returns to the previous screen when there is one', () => {
    mockRouter.canGoBack.mockReturnValue(true);

    pressBack(render(screen));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it(`goes to ${fallback} after a refresh, when there is nothing to go back to`, () => {
    mockRouter.canGoBack.mockReturnValue(false);

    pressBack(render(screen));

    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith(fallback);
  });
});
