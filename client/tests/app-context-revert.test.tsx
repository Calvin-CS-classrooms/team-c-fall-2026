// Tests the optimistic-update-with-revert behavior: a change is applied to
// local state immediately, and if the server sync fails the change is reverted
// and an error message is surfaced to the user.

import { Pressable, Text } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { AppProvider, useAppData } from '@/context/app-context';
import { spaces } from '@/data/spaces';
import type { NewRatingInput } from '@/types';

// Mock the API layer so each write can be made to fail on demand.
jest.mock('@/services/campus-api', () => ({
  fetchUserByEmail: jest.fn(),
  submitRating: jest.fn(),
  deleteRating: jest.fn(),
  createFavorite: jest.fn(),
  deleteFavorite: jest.fn(),
  createSpotSuggestion: jest.fn(),
  updateUser: jest.fn(),
}));

const api = jest.requireMock('@/services/campus-api') as {
  fetchUserByEmail: jest.Mock;
  submitRating: jest.Mock;
  deleteRating: jest.Mock;
  createFavorite: jest.Mock;
  deleteFavorite: jest.Mock;
  createSpotSuggestion: jest.Mock;
  updateUser: jest.Mock;
};

const newRating: NewRatingInput = {
  spaceId: 4,
  numStars: 5,
  crowdRating: 30,
  perceivedNoise: 'whisper',
  description: 'The silent floor was empty.',
};

function ContextProbe() {
  const data = useAppData();
  const firstRating = data.ratings[0];

  return (
    <>
      <Text testID="rating-count">{data.ratings.length}</Text>
      <Text testID="favorite-count">{data.favorites.length}</Text>
      <Text testID="suggestion-count">{data.suggestions.length}</Text>
      <Text testID="anonymous-mode">{String(data.settings.anonymousMode)}</Text>
      <Text testID="server-error">{data.serverError ?? 'none'}</Text>
      <Pressable testID="log-in" onPress={() => data.logIn('student@calvin.edu', 'password123')} />
      <Pressable testID="add-rating" onPress={() => data.addRating(newRating)} />
      <Pressable testID="delete-rating" onPress={() => firstRating && data.deleteRating(firstRating.id)} />
      <Pressable
        testID="toggle-favorite"
        onPress={() => data.toggleFavorite(spaces.find((item) => item.id === 4)!)}
      />
      <Pressable
        testID="submit-suggestion"
        onPress={() =>
          data.submitSuggestion({
            name: 'Quiet Nook',
            description: 'Corner seats',
            usage: 'Reading',
            amenities: ['Outlets'],
          })
        }
      />
      <Pressable testID="toggle-anonymous" onPress={() => data.toggleSetting('anonymousMode')} />
      <Pressable testID="clear-error" onPress={data.clearServerError} />
    </>
  );
}

function renderContext() {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <AppProvider serverAvailable>
        <ContextProbe />
      </AppProvider>,
    );
  });
  return renderer;
}

function getNode(renderer: ReactTestRenderer, testID: string) {
  return renderer.root.findByProps({ testID });
}

async function logInAs(view: ReactTestRenderer) {
  await act(async () => {
    await getNode(view, 'log-in').props.onPress();
  });
}

// Lets the rejected promise's catch handler run before assertions.
async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  api.fetchUserByEmail.mockResolvedValue({
    id: 1,
    firstName: 'Student',
    lastName: null,
    email: 'student@calvin.edu',
    createdAt: '2026-09-01T12:00:00.000Z',
    isVerified: true,
    isAnonymous: false,
    hasLocationAccess: false,
    numRatings: 0,
    allowsNotifications: true,
    deletionScheduledFor: null,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('optimistic updates with revert', () => {
  it('keeps a rating when the server accepts it', async () => {
    api.submitRating.mockResolvedValue({});
    const view = renderContext();
    await logInAs(view);
    const before = Number(getNode(view, 'rating-count').props.children);

    act(() => getNode(view, 'add-rating').props.onPress());
    await flush();

    expect(getNode(view, 'rating-count').props.children).toBe(before + 1);
    expect(getNode(view, 'server-error').props.children).toBe('none');
  });

  it('reverts a rating and notifies the user when the server rejects it', async () => {
    api.submitRating.mockRejectedValue(new Error('API returned 500'));
    const view = renderContext();
    await logInAs(view);
    const before = Number(getNode(view, 'rating-count').props.children);

    act(() => getNode(view, 'add-rating').props.onPress());
    // Applied optimistically before the server answers.
    expect(getNode(view, 'rating-count').props.children).toBe(before + 1);

    await flush();

    expect(getNode(view, 'rating-count').props.children).toBe(before);
    expect(getNode(view, 'server-error').props.children).toBe(
      'Your rating could not be saved. Please try again.',
    );
  });

  it('restores a deleted rating when the server rejects the delete', async () => {
    api.deleteRating.mockRejectedValue(new Error('API returned 500'));
    const view = renderContext();
    await logInAs(view);
    const before = Number(getNode(view, 'rating-count').props.children);

    act(() => getNode(view, 'delete-rating').props.onPress());
    expect(getNode(view, 'rating-count').props.children).toBe(before - 1);

    await flush();

    expect(getNode(view, 'rating-count').props.children).toBe(before);
    expect(getNode(view, 'server-error').props.children).toBe(
      'Your rating could not be deleted. Please try again.',
    );
  });

  it('reverts a favorite toggle when the server rejects it', async () => {
    // Space 4 starts out favorited, so toggling it removes the favorite.
    api.deleteFavorite.mockRejectedValue(new Error('API returned 500'));
    const view = renderContext();
    await logInAs(view);
    const before = Number(getNode(view, 'favorite-count').props.children);

    act(() => getNode(view, 'toggle-favorite').props.onPress());
    expect(getNode(view, 'favorite-count').props.children).toBe(before - 1);

    await flush();

    expect(getNode(view, 'favorite-count').props.children).toBe(before);
    expect(getNode(view, 'server-error').props.children).toBe(
      'Your favorite could not be removed. Please try again.',
    );
  });

  it('reverts a suggestion when the server rejects it', async () => {
    api.createSpotSuggestion.mockRejectedValue(new Error('API returned 500'));
    const view = renderContext();
    await logInAs(view);
    const before = Number(getNode(view, 'suggestion-count').props.children);

    act(() => getNode(view, 'submit-suggestion').props.onPress());
    expect(getNode(view, 'suggestion-count').props.children).toBe(before + 1);

    await flush();

    expect(getNode(view, 'suggestion-count').props.children).toBe(before);
    expect(getNode(view, 'server-error').props.children).toBe(
      'Your suggestion could not be saved. Please try again.',
    );
  });

  it('reverts a preference toggle when the server rejects it', async () => {
    api.updateUser.mockRejectedValue(new Error('API returned 500'));
    const view = renderContext();
    await logInAs(view);
    const before = getNode(view, 'anonymous-mode').props.children;

    act(() => getNode(view, 'toggle-anonymous').props.onPress());
    expect(getNode(view, 'anonymous-mode').props.children).not.toBe(before);

    await flush();

    expect(getNode(view, 'anonymous-mode').props.children).toBe(before);
    expect(getNode(view, 'server-error').props.children).toBe(
      'Your preference could not be saved. Please try again.',
    );
  });

  it('clears the error message when dismissed', async () => {
    api.submitRating.mockRejectedValue(new Error('API returned 500'));
    const view = renderContext();
    await logInAs(view);

    act(() => getNode(view, 'add-rating').props.onPress());
    await flush();
    expect(getNode(view, 'server-error').props.children).not.toBe('none');

    act(() => getNode(view, 'clear-error').props.onPress());
    expect(getNode(view, 'server-error').props.children).toBe('none');
  });
});
