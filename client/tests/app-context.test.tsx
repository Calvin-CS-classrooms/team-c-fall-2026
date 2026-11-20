import { Pressable, Text } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { AppProvider, useAppData } from '@/context/app-context';
import { initialRatings, setInitialRatings } from '@/data/ratings';
import { spaces } from '@/data/spaces';
import type { NewRatingInput } from '@/types';

function ContextProbe() {
  const data = useAppData();
  const firstRating = data.ratings[0];
  const silentFloorFavorite = data.isFavorite(4);

  return (
    <>
      <Text testID="rating-count">{data.ratings.length}</Text>
      <Text testID="first-rating-id">{firstRating?.id}</Text>
      <Text testID="first-upvote-count">{firstRating?.numUpvotes}</Text>
      <Text testID="silent-floor-favorite">{String(silentFloorFavorite)}</Text>
      <Text testID="geolocation">{String(data.settings.geolocation)}</Text>
      <Text testID="account-email">{data.account?.email ?? 'none'}</Text>
      <Text testID="deletion-scheduled">{String(Boolean(data.account?.deletionScheduledFor))}</Text>
      <Text testID="suggestion-count">{data.suggestions.length}</Text>
      <Text testID="atrium-status">{data.suggestions.find((s) => s.id === 1)?.status}</Text>
      <Text testID="space-count">{data.spaces.length}</Text>
      <Text testID="space-4-rating">{data.spaces.find((space) => space.id === 4)?.overallRating}</Text>
      <Pressable
        testID="set-calvin-email"
        onPress={() => data.logIn('student@calvin.edu', 'password123')}
      />
      <Pressable testID="create-invalid-account" onPress={() => data.logIn('student@gmail.com', 'password123')} />
      <Pressable testID="log-in-short-password" onPress={() => data.logIn('student@calvin.edu', '123')} />
      <Pressable testID="log-out" onPress={data.logOut} />
      <Text testID="account-name">
        {data.account ? [data.account.firstName, data.account.lastName].filter(Boolean).join(' ') : 'none'}
      </Text>
      <Text testID="first-anonymous">{String(firstRating?.isAnonymous ?? false)}</Text>
      <Text testID="own-public-count">
        {data.ratings.filter((rating) => rating.userId === 1 && !rating.isAnonymous).length}
      </Text>
      <Pressable
        testID="delete-other-rating"
        onPress={() => data.deleteRating(data.ratings.find((r) => r.userId !== data.account?.id)!.id)}
      />
      <Pressable testID="toggle-anonymous" onPress={() => data.toggleSetting('anonymousMode')} />
      <Pressable testID="request-deletion" onPress={data.requestAccountDeletion} />
      <Pressable testID="cancel-deletion" onPress={data.cancelAccountDeletion} />
      <Pressable testID="finalize-deletion" onPress={data.finalizeAccountDeletion} />
      <Pressable
        testID="submit-suggestion"
        onPress={() =>
          data.submitSuggestion({ name: 'Quiet Nook', description: 'Corner seats', usage: 'Reading', amenities: ['Outlets'] })
        }
      />
      <Pressable testID="upvote-atrium" onPress={() => data.voteOnSuggestion(1, 1)} />
      <Pressable testID="add-rating" onPress={() => data.addRating(newRating)} />
      <Pressable testID="add-anonymous-rating" onPress={() => data.addRating({ ...newRating, isAnonymous: true })} />
      <Pressable testID="add-public-rating" onPress={() => data.addRating({ ...newRating, isAnonymous: false })} />
      <Pressable
        testID="make-first-anonymous"
        onPress={() => firstRating && data.setRatingAnonymous(firstRating.id, true)}
      />
      <Pressable
        testID="make-first-public"
        onPress={() => firstRating && data.setRatingAnonymous(firstRating.id, false)}
      />
      <Pressable
        testID="make-other-anonymous"
        onPress={() => {
          const other = data.ratings.find((r) => r.userId !== data.account?.id && !r.isAnonymous);
          if (other) data.setRatingAnonymous(other.id, true);
        }}
      />
      <Text testID="others-public-count">
        {data.ratings.filter((rating) => rating.userId !== data.account?.id && !rating.isAnonymous).length}
      </Text>
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
        onPress={() => data.toggleFavorite(spaces.find((item) => item.id === 4)!)}
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

// Logs in as the test student, awaiting the async logIn so the account state
// is set before assertions run.
async function logInAs(view: ReactTestRenderer) {
  await act(async () => {
    await getNode(view, 'set-calvin-email').props.onPress();
  });
}

const newRating: NewRatingInput = {
  spaceId: 4,
  numStars: 5,
  crowdRating: 30,
  perceivedNoise: 'whisper',
  description: 'The silent floor was empty.',
};

describe('AppProvider', () => {
  it('gives new ratings ids above the highest loaded rating id, e.g. ratings from the server', async () => {
    const bundled = initialRatings;
    setInitialRatings([{ ...bundled[0], id: 500 }]);
    try {
      const view = renderContext();
      await logInAs(view);
      act(() => getNode(view, 'add-rating').props.onPress());

      expect(getNode(view, 'first-rating-id').props.children).toBe(501);
    } finally {
      setInitialRatings(bundled);
    }
  });

  it('blocks rating submissions without a Calvin email', () => {
    const view = renderContext();
    const initialCount = Number(getNode(view, 'rating-count').props.children);

    act(() => getNode(view, 'add-rating').props.onPress());

    expect(getNode(view, 'rating-count').props.children).toBe(initialCount);
  });

  it('adds a rating, marks it helpful, and deletes it', async () => {
    const view = renderContext();
    const initialCount = Number(getNode(view, 'rating-count').props.children);

    await logInAs(view);
    act(() => getNode(view, 'add-rating').props.onPress());

    expect(getNode(view, 'rating-count').props.children).toBe(initialCount + 1);
    expect(getNode(view, 'first-rating-id').props.children).toBeGreaterThan(0);
    expect(getNode(view, 'first-upvote-count').props.children).toBe(0);

    act(() => getNode(view, 'mark-helpful').props.onPress());
    expect(getNode(view, 'first-upvote-count').props.children).toBe(1);

    act(() => getNode(view, 'delete-rating').props.onPress());
    expect(getNode(view, 'rating-count').props.children).toBe(initialCount);
  });

  it("updates the space's rating when a rating is added, and restores it when deleted", async () => {
    const view = renderContext();
    const before = getNode(view, 'space-4-rating').props.children;

    await logInAs(view);
    // The test rating is 5 stars for space 4, which starts below 5.
    act(() => getNode(view, 'add-rating').props.onPress());
    const afterAdd = getNode(view, 'space-4-rating').props.children;

    act(() => getNode(view, 'delete-rating').props.onPress());
    const afterDelete = getNode(view, 'space-4-rating').props.children;

    expect(before).toBeLessThan(5);
    expect(afterAdd).toBeGreaterThan(before);
    expect(afterDelete).toBe(before);
  });

  it('only logs in Calvin emails with a long-enough password, and logs out', async () => {
    const view = renderContext();

    await act(async () => {
      await getNode(view, 'create-invalid-account').props.onPress();
    });
    expect(getNode(view, 'account-email').props.children).toBe('none');

    await act(async () => {
      await getNode(view, 'log-in-short-password').props.onPress();
    });
    expect(getNode(view, 'account-email').props.children).toBe('none');

    await logInAs(view);
    expect(getNode(view, 'account-email').props.children).toBe('student@calvin.edu');
    expect(getNode(view, 'account-name').props.children).toBe('Student');

    act(() => getNode(view, 'log-out').props.onPress());
    expect(getNode(view, 'account-email').props.children).toBe('none');
  });

  it("does not let a user delete another student's rating", async () => {
    const view = renderContext();
    const initialCount = getNode(view, 'rating-count').props.children;

    await logInAs(view);
    act(() => getNode(view, 'delete-other-rating').props.onPress());

    expect(getNode(view, 'rating-count').props.children).toBe(initialCount);
  });

  it('schedules, cancels, and finalizes account deletion while keeping ratings', async () => {
    const view = renderContext();
    await logInAs(view);
    act(() => getNode(view, 'add-rating').props.onPress());
    const countWithRating = getNode(view, 'rating-count').props.children;

    act(() => getNode(view, 'request-deletion').props.onPress());
    expect(getNode(view, 'deletion-scheduled').props.children).toBe('true');

    act(() => getNode(view, 'cancel-deletion').props.onPress());
    expect(getNode(view, 'deletion-scheduled').props.children).toBe('false');

    act(() => getNode(view, 'request-deletion').props.onPress());
    act(() => getNode(view, 'finalize-deletion').props.onPress());

    expect(getNode(view, 'account-email').props.children).toBe('none');
    expect(getNode(view, 'rating-count').props.children).toBe(countWithRating);
  });

  it('limits suggestions to one per day', async () => {
    const view = renderContext();
    const initialSuggestions = getNode(view, 'suggestion-count').props.children;
    await logInAs(view);

    act(() => getNode(view, 'submit-suggestion').props.onPress());
    act(() => getNode(view, 'submit-suggestion').props.onPress());
    expect(getNode(view, 'suggestion-count').props.children).toBe(initialSuggestions + 1);
  });

  it('marks ratings anonymous only while Anonymous Mode is on', async () => {
    const view = renderContext();
    await logInAs(view);

    act(() => getNode(view, 'toggle-anonymous').props.onPress());
    act(() => getNode(view, 'add-rating').props.onPress());
    expect(getNode(view, 'first-anonymous').props.children).toBe('true');

    act(() => getNode(view, 'toggle-anonymous').props.onPress());
    act(() => getNode(view, 'add-rating').props.onPress());
    expect(getNode(view, 'first-anonymous').props.children).toBe('false');
  });

  it('uses the choice made on the form, whatever Anonymous Mode is set to', async () => {
    const view = renderContext();
    await logInAs(view);

    // Anonymous Mode is off, but this rating was posted anonymously.
    act(() => getNode(view, 'add-anonymous-rating').props.onPress());
    expect(getNode(view, 'first-anonymous').props.children).toBe('true');

    // Anonymous Mode is on, but this rating was posted with the name shown.
    act(() => getNode(view, 'toggle-anonymous').props.onPress());
    act(() => getNode(view, 'add-public-rating').props.onPress());
    expect(getNode(view, 'first-anonymous').props.children).toBe('false');
  });

  it('lets a student change whether their own rating is anonymous', async () => {
    const view = renderContext();
    await logInAs(view);
    act(() => getNode(view, 'add-public-rating').props.onPress());

    act(() => getNode(view, 'make-first-anonymous').props.onPress());
    expect(getNode(view, 'first-anonymous').props.children).toBe('true');

    act(() => getNode(view, 'make-first-public').props.onPress());
    expect(getNode(view, 'first-anonymous').props.children).toBe('false');
  });

  it("does not let a student change another student's rating", async () => {
    const view = renderContext();
    await logInAs(view);
    const othersPublic = getNode(view, 'others-public-count').props.children;

    act(() => getNode(view, 'make-other-anonymous').props.onPress());

    expect(getNode(view, 'others-public-count').props.children).toBe(othersPublic);
  });

  it("makes a deleted account's ratings anonymous but keeps them", async () => {
    const view = renderContext();
    await logInAs(view);
    act(() => getNode(view, 'add-rating').props.onPress());
    const ratingCount = getNode(view, 'rating-count').props.children;
    expect(getNode(view, 'own-public-count').props.children).toBeGreaterThan(0);

    act(() => getNode(view, 'request-deletion').props.onPress());
    act(() => getNode(view, 'finalize-deletion').props.onPress());

    expect(getNode(view, 'rating-count').props.children).toBe(ratingCount);
    expect(getNode(view, 'own-public-count').props.children).toBe(0);
  });

  it('toggles favorites and settings', () => {
    const view = renderContext();
    const initialFavorite = getNode(view, 'silent-floor-favorite').props.children;
    const initialGeolocation = getNode(view, 'geolocation').props.children;

    act(() => getNode(view, 'toggle-favorite').props.onPress());
    expect(getNode(view, 'silent-floor-favorite').props.children).toBe(
      initialFavorite === 'true' ? 'false' : 'true',
    );

    act(() => getNode(view, 'toggle-favorite').props.onPress());
    expect(getNode(view, 'silent-floor-favorite').props.children).toBe(initialFavorite);

    act(() => getNode(view, 'toggle-geolocation').props.onPress());
    expect(getNode(view, 'geolocation').props.children).toBe(
      initialGeolocation === 'true' ? 'false' : 'true',
    );
  });
});
