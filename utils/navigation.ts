import { router, type Href } from 'expo-router';

/**
 * `router.back()` throws "GO_BACK was not handled by any navigator" when
 * there's no screen to go back to — e.g. a deep link, or a web page
 * refresh that lands directly on this route with no history behind it.
 * This checks first and falls back to `fallback` instead of failing.
 */
export function goBack(fallback: Href = '/home'): void {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
