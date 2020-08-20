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
