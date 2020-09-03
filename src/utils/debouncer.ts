import { raf, delay as delayFn } from './utils';

/**
 * Handles debouncing of events via requestAnimationFrame
 *
 * @param callback The callback to handle whichever event
 */
export function debounce(callback: (...args: unknown[]) => unknown, delay = 100) {
  let timeoutId: NodeJS.Timeout;

  return (...args: unknown[]) => {
    clearTimeout(timeoutId);

    timeoutId = delayFn(() => {
      raf(() => {
        timeoutId = null;

        callback(...args);
      });
    }, delay);
  };
}
