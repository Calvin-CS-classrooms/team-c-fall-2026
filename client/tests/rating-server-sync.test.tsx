// Tests what is sent to the server when a rating is submitted while the
// server is available. The Supabase ratings table has no isAnonymous column
// yet, so sending it would make the insert fail.
import { Pressable } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { AppProvider, useAppData } from '@/context/app-context';
import { fetchUserByEmail, submitRating } from '@/services/campus-api';

jest.mock('@/services/campus-api', () => ({
  ...jest.requireActual('@/services/campus-api'),
  fetchUserByEmail: jest.fn(),
  submitRating: jest.fn(),
}));

const mockFetchUser = fetchUserByEmail as jest.MockedFunction<typeof fetchUserByEmail>;
const mockSubmit = submitRating as jest.MockedFunction<typeof submitRating>;

function Probe() {
  const data = useAppData();
  return (
    <>
      <Pressable testID="log-in" onPress={() => data.logIn('emma.k@calvin.edu', 'password123')} />
      <Pressable
        testID="rate"
        onPress={() =>
          data.addRating({ spaceId: 3, numStars: 4, crowdRating: 40, perceivedNoise: 'lowBuzz', isAnonymous: true })
        }
      />
    </>
  );
}

it('does not send the anonymous choice to the server', async () => {
  mockFetchUser.mockResolvedValue({
    id: 1,
    firstName: 'Emma',
    lastName: 'Kuipers',
    email: 'emma.k@calvin.edu',
    createdAt: '2026-09-01T12:00:00.000Z',
    isVerified: true,
    isAnonymous: false,
    hasLocationAccess: false,
    numRatings: 1,
    allowsNotifications: true,
    deletionScheduledFor: null,
  });
  mockSubmit.mockResolvedValue({} as never);

  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <AppProvider serverAvailable>
        <Probe />
      </AppProvider>,
    );
  });
  await act(async () => {
    await renderer.root.findByProps({ testID: 'log-in' }).props.onPress();
  });
  act(() => renderer.root.findByProps({ testID: 'rate' }).props.onPress());

  expect(mockSubmit).toHaveBeenCalledTimes(1);
  expect(mockSubmit.mock.calls[0][0]).not.toHaveProperty('isAnonymous');
  expect(mockSubmit.mock.calls[0][0]).toEqual(expect.objectContaining({ spaceId: 3, numStars: 4, userId: 1 }));
});
