/**
 * A root class name.
 */
const ROOT = 'virchual';

/**
 * The definition table of all classes for elements.
 * They might be modified by options.
 */
export const ELEMENT_CLASSES = {
  root: ROOT,
  slider: `${ROOT}__slider`,
  track: `${ROOT}__track`,
  list: `${ROOT}__list`,
  slide: `${ROOT}__slide`,
  container: `${ROOT}__slide__container`,
  arrows: `${ROOT}__arrows`,
  arrow: `${ROOT}__arrow`,
  prev: `${ROOT}__arrow--prev`,
  next: `${ROOT}__arrow--next`,
  pagination: `${ROOT}__pagination`,
  paginationTrack: `${ROOT}__pagination-track`,
  page: `${ROOT}__pagination__page`,
  clone: `${ROOT}__slide--clone`,
  progress: `${ROOT}__progress`,
  bar: `${ROOT}__progress__bar`,
  autoplay: `${ROOT}__autoplay`,
  play: `${ROOT}__play`,
  pause: `${ROOT}__pause`,
  spinner: `${ROOT}__spinner`,
  sr: `${ROOT}__sr`,
};

/**
 * Definitions of status classes.
 */
export const STATUS_CLASSES = {
  active: 'is-active',
  visible: 'is-visible',
  loading: 'is-loading',
};
