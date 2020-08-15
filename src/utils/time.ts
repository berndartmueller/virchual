/**
 * Simple throttle function that controls how often the given function is executed.
 *
 * @param func - A function to be throttled.
 * @param wait - Time in millisecond for interval of execution.
 *
 * @return A debounced function.
 */
export function throttle(func: Function, wait: number): Function {
  let timeout;

  // Declare function by the "function" keyword to prevent "this" from being inherited.
  return function () {
    if (!timeout) {
      timeout = setTimeout(() => {
        func();
        timeout = null;
      }, wait);
    }
  };
}
