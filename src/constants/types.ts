/**
 * Normal slider.
 */
export const SLIDE = 'slide';

/**
 * Loop after the last slide and before the first one.
 */
export const LOOP = 'loop';

/**
 * The track doesn't move.
 */
export const FADE = 'fade';

export type SliderType = typeof SLIDE | typeof LOOP | typeof FADE;
