// Tests finding the building the student is in, with expo-location faked.
import * as ExpoLocation from 'expo-location';
import { Pressable, Text } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { useCurrentBuilding } from '@/hooks/use-current-building';
import type { Location } from '@/types';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

const mockPermission = ExpoLocation.requestForegroundPermissionsAsync as jest.Mock;
const mockPosition = ExpoLocation.getCurrentPositionAsync as jest.Mock;

const HEKMAN = { latitude: 42.9297932, longitude: -85.5875716 };
const buildings: Location[] = [
  {
    id: 1,
    name: 'Hekman Library',
    image: undefined,
    description: '',
    numFloors: 5,
    numSpaces: 5,
    hours: { openingTime: '07:00', closingTime: '01:00' },
    ...HEKMAN,
  },
];

function Probe({ enabled }: { enabled: boolean }) {
  const { status, building, retry } = useCurrentBuilding(enabled, buildings);
  return (
    <>
      <Text testID="status">{status}</Text>
      <Text testID="building">{building?.name ?? 'none'}</Text>
      <Pressable testID="retry" onPress={retry} />
    </>
  );
}

async function render(enabled = true) {
  let renderer!: ReactTestRenderer;
  await act(async () => {
    renderer = create(<Probe enabled={enabled} />);
  });
  return renderer;
}

const read = (renderer: ReactTestRenderer, testID: string) => renderer.root.findByProps({ testID }).props.children;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('useCurrentBuilding', () => {
  it('does nothing while Geolocation is off', async () => {
    const view = await render(false);

    expect(read(view, 'status')).toBe('off');
    expect(mockPermission).not.toHaveBeenCalled();
  });

  it('finds the building the student is in', async () => {
    mockPermission.mockResolvedValue({ granted: true });
    mockPosition.mockResolvedValue({ coords: { latitude: HEKMAN.latitude + 0.0001, longitude: HEKMAN.longitude } });

    const view = await render();

    expect(read(view, 'status')).toBe('found');
    expect(read(view, 'building')).toBe('Hekman Library');
    expect(mockPosition).toHaveBeenCalledWith({ accuracy: ExpoLocation.Accuracy.Balanced });
  });

  it('says so when the student is not near any building', async () => {
    mockPermission.mockResolvedValue({ granted: true });
    mockPosition.mockResolvedValue({ coords: { latitude: 42.92, longitude: -85.6 } });

    const view = await render();

    expect(read(view, 'status')).toBe('not-near');
    expect(read(view, 'building')).toBe('none');
  });

  it('stops when location permission is denied', async () => {
    mockPermission.mockResolvedValue({ granted: false });

    const view = await render();

    expect(read(view, 'status')).toBe('denied');
    expect(mockPosition).not.toHaveBeenCalled();
  });

  it('reports when the position cannot be read', async () => {
    mockPermission.mockResolvedValue({ granted: true });
    mockPosition.mockRejectedValue(new Error('Location services are off'));

    const view = await render();

    expect(read(view, 'status')).toBe('unavailable');
  });

  it('asks again when the student taps retry', async () => {
    mockPermission.mockResolvedValueOnce({ granted: false }).mockResolvedValueOnce({ granted: true });
    mockPosition.mockResolvedValue({ coords: HEKMAN });
    const view = await render();
    expect(read(view, 'status')).toBe('denied');

    await act(async () => {
      view.root.findByProps({ testID: 'retry' }).props.onPress();
    });

    expect(mockPermission).toHaveBeenCalledTimes(2);
    expect(read(view, 'status')).toBe('found');
  });
});
