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

/**
 * Custom setInterval function that provides progress rate as callback.
 *
 * @param callback - A callback function fired every time the interval time passes.
 * @param interval - Interval duration in milliseconds.
 * @param progress - A callback function fired whenever the progress goes.
 *
 * @return An object containing play() and pause() functions.
 */
export function createInterval(callback: Function, interval: number, progress: Function): object {
  const { requestAnimationFrame } = window;
  let start,
    elapse,
    rate,
    pause = true;

  const step = timestamp => {
    if (!pause) {
      if (!start) {
        start = timestamp;
      }

      elapse = timestamp - start;
      rate = elapse / interval;

      if (elapse >= interval) {
        start = 0;
        rate = 1;
        callback();
      }

      if (progress) {
        progress(rate);
      }

      requestAnimationFrame(step);
    }
  };

  return {
    pause() {
      pause = true;
      start = 0;
    },

    play() {
      start = 0;

      if (pause) {
        pause = false;
        requestAnimationFrame(step);
      }
    },
  };
}
