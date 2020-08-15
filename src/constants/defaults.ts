import { ELEMENT_CLASSES as classes } from './classes';
import { I18N as i18n } from './i18n';

export const DEFAULTS = {
  /**
   * Determine a slider type.
   * - 'slide': Regular slider.
   * - 'loop' : Carousel slider.
   * - 'fade' : Change slides with fade transition. perPage, drag options are ignored.
   */
  type: 'slide',

  /**
   * Whether to rewind a slider before the first slide or after the last one.
   * In "loop" mode, this option is ignored.
   */
  rewind: false,

  /**
   * Transition speed in milliseconds.
   */
  speed: 400,

  /**
   * Transition speed on rewind in milliseconds.
   */
  rewindSpeed: 0,

  /**
   * Define slider max width.
   */
  width: 0,

  /**
   * Define slider height.
   */
  height: 0,

  /**
   * Fix width of slides. CSS format is allowed such as 10em, 80% or 80vw.
   * perPage number will be ignored when this option is falsy.
   */
  fixedWidth: 0,

  /**
   * Fix height of slides. CSS format is allowed such as 10em, 80vh but % unit is not accepted.
   * heightRatio option will be ignored when this option is falsy.
   */
  fixedHeight: 0,

  /**
   * Determine height of slides by ratio to a slider width.
   * This will be ignored when the fixedHeight is provided.
   */
  heightRatio: 0,

  /**
   * If true, slide width will be determined by the element width itself.
   * - perPage/perMove should be 1.
   * - lazyLoad should be false.
   */
  autoWidth: false,

  /**
   * Determine how many slides should be displayed per page.
   */
  perPage: 1,

  /**
   * Determine how many slides should be moved when a slider goes to next or perv.
   */
  perMove: 0,

  /**
   * Start index.
   */
  start: 0,

  /**
   * Determine which slide should be focused if there are multiple slides in a page.
   * A string "center" is acceptable for centering slides.
   */
  focus: false,

  /**
   * Gap between slides. CSS format is allowed such as 1em.
   */
  gap: 0,

  /**
   * Set padding-left/right in horizontal mode or padding-top/bottom in vertical one.
   * Give a single value to set a same size for both sides or
   * do an object for different sizes.
   * Also, CSS format is allowed such as 1em.
   *
   * @example
   * - 10: Number
   * - '1em': CSS format.
   * - { left: 0, right: 20 }: Object for different sizes in horizontal mode.
   * - { top: 0, bottom: 20 }: Object for different sizes in vertical mode.
   */
  padding: 0,

  /**
   * Whether to append arrows.
   */
  arrows: true,

  /**
   * Change the arrow SVG path like 'm7.61 0.807-2.12...'.
   */
  arrowPath: '',

  /**
   * Whether to append pagination(indicator dots) or not.
   */
  pagination: true,

  /**
   * Activate autoplay.
   */
  autoplay: false,

  /**
   * Autoplay interval in milliseconds.
   */
  interval: 5000,

  /**
   * Whether to stop autoplay when a slider is hovered.
   */
  pauseOnHover: true,

  /**
   * Whether to stop autoplay when a slider elements are focused.
   * True is recommended for accessibility.
   */
  pauseOnFocus: true,

  /**
   * Loading images lazily.
   * Image src must be provided by a data-splide-lazy attribute.
   *
   * - false: Do nothing.
   * - 'nearby': Only images around an active slide will be loaded.
   * - 'sequential': All images will be sequentially loaded.
   */
  lazyLoad: false,

  /**
   * This option works only when a lazyLoad option is "nearby".
   * Determine how many pages(not slides) around an active slide should be loaded beforehand.
   */
  preloadPages: 1,

  /**
   * Easing for CSS transition. For example, linear, ease or cubic-bezier().
   */
  easing: 'cubic-bezier(.42,.65,.27,.99)',

  /**
   * Whether to control a slide via keyboard.
   */
  keyboard: true,

  /**
   * Whether to allow mouse drag and touch swipe.
   */
  drag: true,

  /**
   * The angle threshold for drag.
   * The slider starts moving only when the drag angle is less than this threshold.
   */
  dragAngleThreshold: 30,

  /**
   * Distance threshold for determining if the action is "flick" or "swipe".
   * When a drag distance is over this value, the action will be treated as "swipe", not "flick".
   */
  swipeDistanceThreshold: 150,

  /**
   * Velocity threshold for determining if the action is "flick" or "swipe".
   * Around 0.5 is recommended.
   */
  flickVelocityThreshold: 0.6,

  /**
   * Determine power of flick. The larger number this is, the farther a slider runs by flick.
   * Around 500 is recommended.
   */
  flickPower: 600,

  /**
   * Limit a number of pages to move by flick.
   */
  flickMaxPages: 1,

  /**
   * Slider direction.
   * - 'ltr': Left to right.
   * - 'rtl': Right to left.
   * - 'ttb': Top to bottom.
   */
  direction: 'ltr',

  /**
   * Set img src to background-image of its parent element.
   * Images with various sizes can be displayed as same dimension without cropping work.
   * fixedHeight or heightRatio is required.
   */
  cover: false,

  /**
   * Whether to enable accessibility(aria and screen reader texts) or not.
   */
  accessibility: true,

  /**
   * Determine if a slider is navigation for another.
   * Use "sync" API to synchronize two sliders.
   */
  isNavigation: false,

  /**
   * Whether to trim spaces before the fist slide or after the last one when "focus" is not 0.
   */
  trimSpace: true,

  /**
   * Slide status is updated after move as default.
   * If true, it will be updated before move.
   */
  updateOnMove: false,

  /**
   * Breakpoints definitions.
   *
   * @example
   * {
   *   '1000': {
   *     perPage: 3,
   *     gap: 20
   *   },
   *   '600': {
   *     perPage: 1,
   *     gap: 5,
   *   }
   * }
   */
  breakpoints: false,

  /**
   * Collection of class names.
   *
   * @see ./classes.js
   */
  classes,

  /**
   * Collection of i18n texts.
   *
   * @see ./i18n.js
   */
  i18n,
};
