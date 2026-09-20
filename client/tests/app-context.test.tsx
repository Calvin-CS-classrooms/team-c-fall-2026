import { Pressable, Text } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { AppProvider, useAppData } from '@/context/app-context';
import { locations } from '@/data/locations';
import type { NewRatingInput } from '@/types';

function ContextProbe() {
  const data = useAppData();
  const firstRating = data.ratings[0];
  const morrenFavorite = data.isFavorite('morren-fitness');

  return (
    <>
      <Text testID="rating-count">{data.ratings.length}</Text>
      <Text testID="first-rating-id">{firstRating?.id}</Text>
      <Text testID="first-helpful-count">{firstRating?.helpfulCount}</Text>
      <Text testID="morren-favorite">{String(morrenFavorite)}</Text>
      <Text testID="geolocation">{String(data.settings.geolocation)}</Text>
      <Pressable testID="add-rating" onPress={() => data.addRating(newRating)} />
      <Pressable
        testID="mark-helpful"
        onPress={() => firstRating && data.markHelpful(firstRating.id)}
      />
      <Pressable
        testID="delete-rating"
        onPress={() => firstRating && data.deleteRating(firstRating.id)}
      />
      <Pressable
        testID="toggle-favorite"
        onPress={() => data.toggleFavorite(locations.find((item) => item.id === 'morren-fitness')!)}
      />
      <Pressable testID="toggle-geolocation" onPress={() => data.toggleSetting('geolocation')} />
    </>
  );
}

function renderContext() {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <AppProvider>
        <ContextProbe />
      </AppProvider>,
    );
  });
  return renderer;
}

function getNode(renderer: ReactTestRenderer, testID: string) {
  return renderer.root.findByProps({ testID });
}

const newRating: NewRatingInput = {
  locationId: 'morren-fitness',
  locationName: 'Morren Fitness Center',
  stars: 5,
  capacity: 30,
  noise: 'low-buzz',
  amenities: ['Outlets'],
  comment: 'The track is open.',
};

describe('AppProvider', () => {
  it('adds a rating, marks it helpful, and deletes it', () => {
    const view = renderContext();
    const initialCount = Number(getNode(view, 'rating-count').props.children);

    act(() => getNode(view, 'add-rating').props.onPress());
    expect(getNode(view, 'rating-count').props.children).toBe(initialCount + 1);
    expect(getNode(view, 'first-rating-id').props.children).toMatch(/^local-rating-/);
    expect(getNode(view, 'first-helpful-count').props.children).toBe(0);

    act(() => getNode(view, 'mark-helpful').props.onPress());
    expect(getNode(view, 'first-helpful-count').props.children).toBe(1);

    act(() => getNode(view, 'delete-rating').props.onPress());
    expect(getNode(view, 'rating-count').props.children).toBe(initialCount);
  });

  it('toggles favorites and settings', () => {
    const view = renderContext();
    const initialFavorite = getNode(view, 'morren-favorite').props.children;
    const initialGeolocation = getNode(view, 'geolocation').props.children;

    act(() => getNode(view, 'toggle-favorite').props.onPress());
    expect(getNode(view, 'morren-favorite').props.children).toBe(
      initialFavorite === 'true' ? 'false' : 'true',
    );

    act(() => getNode(view, 'toggle-favorite').props.onPress());
    expect(getNode(view, 'morren-favorite').props.children).toBe(initialFavorite);

    act(() => getNode(view, 'toggle-geolocation').props.onPress());
    expect(getNode(view, 'geolocation').props.children).toBe(
      initialGeolocation === 'true' ? 'false' : 'true',
    );
  });
});
