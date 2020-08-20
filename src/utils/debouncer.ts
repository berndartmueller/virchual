/**
 * Handles debouncing of events via requestAnimationFrame
 *
 * @param {Function} callback The callback to handle whichever event
 */
export function debounce(callback: (...args: any) => any, delay: number = 100) {
  let timeoutId: NodeJS.Timeout;

  return (...args: any) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(
      () =>
        requestAnimationFrame(() => {
          timeoutId = null;

          callback(...args);
        }),
      delay,
    );
  };
}
