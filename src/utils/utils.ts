import { create, append, remove, applyStyle } from './dom';

/**
 * Convert the given value to array.
 *
 * @param value - Any value.
 *
 * @return Array containing the given value.
 */
export function toArray(value: any): any[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Check if the given value is between min and max.
 * Min will be returned when the value is less than min or max will do when greater than max.
 *
 * @param value - A number to be checked.
 * @param m1    - Minimum or maximum number.
 * @param m2    - Maximum or minimum number.
 *
 * @return A value itself, min or max.
 */
export function between(value: number, m1: number, m2: number): number {
  return Math.min(Math.max(value, m1 > m2 ? m2 : m1), m1 > m2 ? m1 : m2);
}

/**
 * Append px unit to the given subject if necessary.
 *
 * @param value - A value that may not include an unit.
 *
 * @return If the value is string, return itself.
 *                    If number, do value + "px". An empty string, otherwise.
 */
export function unit(value: number | string): string {
  const type = typeof value;

  if (type === 'number' && value > 0) {
    return parseFloat(`${value}`) + 'px';
  }

  return type === 'string' ? `${value}` : '';
}

/**
 * Pad start with 0.
 *
 * @param number - A number to be filled with 0.
 *
 * @return Padded number.
 */
export function pad(number: number): string | number {
  return number < 10 ? '0' + number : number;
}

/**
 * Convert the given value to pixel.
 *
 * @param root  - Root element where a dummy div is appended.
 * @param value - CSS value to be converted, such as 10rem.
 *
 * @return Pixel.
 */
export function toPixel(root: HTMLElement, value: string | number): number {
  let pixelValue: number;

  if (typeof value === 'string') {
    const div = create('div', {});

    applyStyle(div, {
      position: 'absolute',
      width: value,
    });

    append(root, div);

    pixelValue = div.clientWidth;

    remove(div);
  } else {
    pixelValue = value;
  }

  return pixelValue;
}

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
    index = 0;
  } else if (index < 0) {
    index = edge;
  }

  return index;
}
