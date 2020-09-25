import { identity } from './../types';

export function range(start: number, end: number): number[] {
  return Array(end - start + 1)
    .fill(0)
    .map((_, idx) => start + idx);
}

/*
 * Rewind the given index if it's out of range.
 *
 * @param index - An index.
 * @param edge - Edge
 *
 * @return A rewound index.
 */
export function rewind(index: number, edge: number): number {
  if (index > edge) {
    return 0;
  }

  if (index < 0) {
    return edge;
  }

  return index;
}

/**
 * Request animation frame wrapper.
 */
export function raf(callback: identity) {
  return requestAnimationFrame(callback);
}

/**
 * Delay execution of given callback function.
 * Basically a wrapper around `window.setTimeout()`
 *
 * @param callback Callback function.
 * @param ms Delay in milliseconds.
 */
export function delay(callback: identity, ms: number) {
  return setTimeout(callback, ms);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
