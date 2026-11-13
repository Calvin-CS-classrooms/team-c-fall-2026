// Navigation helpers shared by screens with their own Back button.

import type { Href } from 'expo-router';

/** The parts of expo-router's router that goBack needs (easy to fake in tests). */
interface BackRouter {
  canGoBack: () => boolean;
  back: () => void;
  replace: (href: Href) => void;
}

/**
 * Returns to the previous screen, or goes to `fallback` when there is none.
 *
 * router.back() silently does nothing when the current screen is the first
 * one in the stack, e.g. after refreshing the browser on /location/1 or
 * opening a deep link. In that case the Back button would look broken, so we
 * replace the current screen with a sensible parent instead.
 *
 * @param router - The router from useRouter().
 * @param fallback - Where to go when there is nothing to go back to. Defaults to Home.
 */
export function goBack(router: BackRouter, fallback: Href = '/') {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
