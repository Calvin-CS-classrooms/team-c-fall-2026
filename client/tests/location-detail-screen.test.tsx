// Renders the building detail page for Hekman Library (location 1) and checks
// the layout: the building photo appears once as a header, the space cards have
// no images of their own, and each card lists what the space offers.
import { Image } from 'expo-image';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { AppProvider } from '@/context/app-context';
import { getLocationById } from '@/data/locations';
import { LocationDetailScreen } from '@/screens/location-detail-screen';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

// Fixed phone-sized metrics so safe-area hooks work outside a real device.
const SAFE_AREA = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function renderScreen() {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <SafeAreaProvider initialMetrics={SAFE_AREA}>
        <AppProvider>
          <LocationDetailScreen />
        </AppProvider>
      </SafeAreaProvider>,
    );
  });
  return renderer;
}

// All rendered text, joined, for simple "is this on screen" checks.
function screenText(renderer: ReactTestRenderer): string {
  return renderer.root
    .findAll((node) => typeof node.props.children === 'string' || typeof node.props.children === 'number')
    .map((node) => String(node.props.children))
    .join('\n');
}

describe('LocationDetailScreen', () => {
  it('shows the building photo exactly once, as the header', () => {
    const view = renderScreen();
    const images = view.root.findAllByType(Image);

    expect(images).toHaveLength(1);
    expect(images[0].props.source).toBe(getLocationById(1)?.image);
    expect(images[0].props.accessibilityLabel).toBe('Photo of Hekman Library');
  });

  it('lists all five Hekman levels', () => {
    const text = screenText(renderScreen());

    for (const level of ['Basement', 'Student Commons', '3rd Floor', '4th Floor', '5th Floor']) {
      expect(text).toContain(`Hekman Library ${level}`);
    }
  });

  it("shows each space's amenities on its card", () => {
    const text = screenText(renderScreen());

    expect(text).toContain("What's here");
    expect(text).toContain('Individual Study Rooms');
    expect(text).toContain('Fireplace');
    expect(text).toContain('Open Social Area');
  });
});
