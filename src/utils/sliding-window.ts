import { range } from './utils';

/**
 * Returns a sliding window section of an array.
 *
 * @param source Source array.
 * @param start The start of the specified portion of the array. Acts as the center of the sliding window.
 * @param len The window size/length. Specifies how many items the window has on each sides.
 */
export function slidingWindow(source: number[], start: number, len: number): number[] {
  if (source.length < 2) {
    return source;
  }

  const left = range(start - len, start - 1).map(index => get(source, index));
  const center = [source[start]];
  const right = range(start + 1, start + len).map(index => get(source, index));

  const window = [...left, ...center, ...right];

  return window;
}

/**
 * Get array item by index.
 *
 * Returning items from the end of the source array when accessing negative indexes or
 * from the start of source array when accessing out of range indexes.
 *
 * @param source Source array.
 * @param index Index of array item to access.
 */
export function get<T>(source: T[], index: number): T {
  if (source.length === 0) {
    return;
  }

  const isOutOfLowerBounds = index < 0;
  const isOutOfUpperBounds = index > source.length - 1;
  const isOutOfBounds = isOutOfLowerBounds || isOutOfUpperBounds;

  const sign = isOutOfUpperBounds ? -1 : +1;
  const multiple = Math.max(Math.floor(Math.abs(index) / source.length), 1);

  if (isOutOfBounds) {
    index += sign * multiple * source.length;
  }

  return source[index];
}
