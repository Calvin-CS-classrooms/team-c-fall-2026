// Tests goBack: return to the previous screen when there is one, otherwise go
// to a fallback screen. Without the fallback, Back does nothing after a page
// refresh or a deep link, because there is no screen behind the current one.
import { goBack } from '@/utils/navigation';

function fakeRouter(canGoBack: boolean) {
  return {
    canGoBack: jest.fn(() => canGoBack),
    back: jest.fn(),
    replace: jest.fn(),
  };
}

describe('goBack', () => {
  it('goes back when there is a previous screen', () => {
    const router = fakeRouter(true);

    goBack(router);

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('goes to Home when there is nothing to go back to', () => {
    const router = fakeRouter(false);

    goBack(router);

    expect(router.back).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/');
  });

  it('uses the given fallback screen', () => {
    const router = fakeRouter(false);

    goBack(router, '/explore');

    expect(router.replace).toHaveBeenCalledWith('/explore');
  });
});
