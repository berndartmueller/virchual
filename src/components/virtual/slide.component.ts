import { addClass, find, getAttribute, hasClass, removeClass, setAttribute } from '../../utils/dom';
import { values } from '../../utils/object';
import { pad } from '../../utils/utils';
import Virchual, { VirchualComponents, VirchualOptions } from '../../virchual';
import TrackComponent from '../track/track.component';
import { STATUS_CLASSES } from './../../constants/classes';
import { TTB } from './../../constants/directions';
import { BaseComponent } from './../base-component';

/**
 * Events for restoring original styles.
 */
const STYLE_RESTORE_EVENTS = 'update.slide';

export class SlideComponent implements BaseComponent {
  /**
   * Container element if available.
   */
  container: HTMLElement;

  /**
   * Whether this is a cloned slide or not.
   */
  isClone: boolean;

  /**
   * Hold the original styles.
   */
  private styles: string;

  private swiperInstance: Virchual;
  private track: TrackComponent;

  /**
   * Events when the slide status is updated.
   * Append a namespace to remove listeners later.
   */
  private statusUpdateEvents: string;

  constructor(
    private options: VirchualOptions,
    public index: number,
    public realIndex: number,
    public slide: HTMLElement,
    public key?: string,
  ) {
    this.container = find(this.slide, `.virchual__list`);
    this.isClone = realIndex > -1;
    this.styles = getAttribute(this.slide, 'style') || '';
    this.statusUpdateEvents = 'ready.slide updated.slide resize.slide ' + (this.options.updateOnMove ? 'move.slide' : 'moved.slide');
  }

  mount(instance: Virchual, components: VirchualComponents) {
    this.swiperInstance = instance;
    this.track = components.Track as TrackComponent;

    if (!this.isClone) {
      this.slide.id = `${this.swiperInstance.root.id}-slide${pad(this.index + 1)}`;
    }

    if (this.key != null) {
      this.slide.dataset.key = this.key;
    }

    this.swiperInstance.on(this.statusUpdateEvents, () => this.update());
    this.swiperInstance.on(STYLE_RESTORE_EVENTS, this.restoreStyles);
  }

  /**
   * Destroy.
   */
  destroy() {
    this.swiperInstance.off(this.statusUpdateEvents);
    this.swiperInstance.off(STYLE_RESTORE_EVENTS);

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
   * @return True if the slide is active or false if not.
   */
  isActive(): boolean {
    return this.swiperInstance.index === this.index;
  }

  /**
   * Check whether this slide is visible in the viewport or not.
   *
   * @return True if the slide is visible or false if not.
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
   * @param from   - Index of a target slide.
   * @param within - True if the slide is within this number.
   *
   * @return True if the slide is within the number or false otherwise.
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
   * @param active        - Is active/visible or not.
   * @param forVisibility - Toggle classes for activity or visibility.
   */
  private updateClasses(active, forVisibility) {
    const type = forVisibility ? 'visible' : 'active';
    const className = STATUS_CLASSES[type];

    if (active) {
      addClass(this.slide, className);

      this.swiperInstance.emit(`${type}`, this.slide);
    } else {
      if (hasClass(this.slide, className)) {
        removeClass(this.slide, className);

        this.swiperInstance.emit(`${forVisibility ? 'hidden' : 'inactive'}`, this.slide);
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
