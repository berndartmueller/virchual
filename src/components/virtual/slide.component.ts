import { TTB } from './../../constants/directions';
import { STATUS_CLASSES } from './../../constants/classes';
import { Event } from './../../core/event';
import { BaseComponent } from './../base-component';
import VirtualSwiper, { VirtualSwiperOptions, VirtualSwiperComponents } from '../../virtual-swiper';
import { find, getAttribute, removeClass, setAttribute, addClass, hasClass } from '../../utils/dom';
import { pad } from '../../utils/utils';
import { values } from '../../utils/object';
import TrackComponent from '../track/track.component';

/**
 * Events for restoring original styles.
 */
const STYLE_RESTORE_EVENTS = 'update.slide';

export class SlideComponent implements BaseComponent {
  /**
   * Container element if available.
   */
  container: Element;

  /**
   * Whether this is a cloned slide or not.
   */
  private isClone: boolean;

  /**
   * Hold the original styles.
   * @type {string}
   */
  private styles: string;

  private swiperInstance: VirtualSwiper;
  private track: TrackComponent;

  /**
   * Events when the slide status is updated.
   * Append a namespace to remove listeners later.
   */
  private statusUpdateEvents: string;

  constructor(private options: VirtualSwiperOptions, public index: number, public realIndex: number, public slide: HTMLElement) {
    this.container = find(this.slide, `.vswiper__list`);
    this.isClone = realIndex > -1;
    this.styles = getAttribute(this.slide, 'style') || '';
    this.statusUpdateEvents = 'ready.slide updated.slide resize.slide ' + (this.options.updateOnMove ? 'move.slide' : 'moved.slide');
  }

  mount(instance: VirtualSwiper, components: VirtualSwiperComponents) {
    this.swiperInstance = instance;
    this.track = components.Track as TrackComponent;

    if (!this.isClone) {
      this.slide.id = `${this.swiperInstance.root.id}-slide${pad(this.index + 1)}`;
    }

    Event.on(this.statusUpdateEvents, () => this.update());
    Event.on(STYLE_RESTORE_EVENTS, this.restoreStyles);
  }

  /**
   * Destroy.
   */
  destroy() {
    Event.off(this.statusUpdateEvents);
    Event.off(STYLE_RESTORE_EVENTS);

    removeClass(this.slide, values(STATUS_CLASSES));

    this.restoreStyles();
  }

  /**
   * Update active and visible status.
   */
  update() {
    this.updateClasses(this.isActive(), false);
    this.updateClasses(this.isVisible(), true);
  }

  /**
   * Check whether this slide is active or not.
   *
   * @return {boolean} - True if the slide is active or false if not.
   */
  isActive() {
    return this.swiperInstance.index === this.index;
  }

  /**
   * Check whether this slide is visible in the viewport or not.
   *
   * @return {boolean} - True if the slide is visible or false if not.
   */
  isVisible() {
    const active = this.isActive();

    if (active) {
      return active;
    }

    const { floor } = Math;
    const prop = this.options.direction === TTB ? 'clientHeight' : 'clientWidth';
    const position = floor(
      (this.track.direction.toPosition(this.index) + this.track.direction.offset(this.index) - this.track.position) *
        this.track.direction.sign,
    );
    const edge = floor(position + this.slide[prop]);
    const size = this.track.list[prop];

    return 0 <= position && position <= size && 0 <= edge && edge <= size;
  }

  /**
   * Calculate how far this slide is from another slide and
   * return true if the distance is within the given number.
   *
   * @param {number} from   - Index of a target slide.
   * @param {number} within - True if the slide is within this number.
   *
   * @return {boolean} - True if the slide is within the number or false otherwise.
   */
  isWithin(from: number, within: number): boolean {
    let diff = Math.abs(from - this.index);

    if (!this.isClone) {
      diff = Math.min(diff, this.swiperInstance.length - diff);
    }

    return diff < within;
  }

  /**
   * Update classes for activity or visibility.
   *
   * @param {boolean} active        - Is active/visible or not.
   * @param {boolean} forVisibility - Toggle classes for activity or visibility.
   */
  private updateClasses(active, forVisibility) {
    const type = forVisibility ? 'visible' : 'active';
    const className = STATUS_CLASSES[type];

    if (active) {
      addClass(this.slide, className);

      Event.emit(`${type}`, this.slide);
    } else {
      if (hasClass(this.slide, className)) {
        removeClass(this.slide, className);

        Event.emit(`${forVisibility ? 'hidden' : 'inactive'}`, this.slide);
      }
    }
  }

  /**
   * Restore the original styles.
   */
  private restoreStyles() {
    setAttribute(this.slide, 'style', this.styles);
  }
}
