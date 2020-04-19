import { applyStyle } from '../../utils/dom';
import ControllerComponent from '../controller/controller.component';
import { SlideTransition } from './../../transitions/slide/index';
import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from './../../virtual-swiper';
import { BaseComponent } from './../base-component';
import { HorizontalDirection } from './directions/horizontal';
import { Event } from './../../core/event';

export default class TrackComponent implements BaseComponent {
  // Store the current position.
  private currPosition: number = 0;

  // Whether the current direction is vertical or not.
  private isVertical: boolean = false;

  // Whether the slider type is FADE or not.
  private isFade: boolean = false;

  private swiperInstance: VirtualSwiper;
  private controller: ControllerComponent;
  private _direction: HorizontalDirection;
  private _list: HTMLElement;
  private _track: HTMLElement;
  private transition: SlideTransition;

  constructor(private options: VirtualSwiperOptions) {}

  get direction() {
    return this._direction;
  }

  get list() {
    return this._list;
  }

  get track() {
    return this._track;
  }

  mount(instance: VirtualSwiper, components: VirtualSwiperComponents) {
    this.swiperInstance = instance;
    this.controller = components.Controller as ControllerComponent;
    this.transition = components.Transition as SlideTransition;
    this._direction = new HorizontalDirection(this.options, instance, components);

    this._track = this.swiperInstance.root.querySelector('.vswiper__track');
    this._list = this.swiperInstance.root.querySelector('.vswiper__list');
  }
  /**
   * Called after the component is mounted.
   * The resize event must be registered after the Layout's one is done.
   */
  mounted() {
    if (!this.isFade) {
      this.swiperInstance.on('mounted resize updated', () => {
        this.jump(this.swiperInstance.index);
      });
    }
  }

  /**
   * Go to the given destination index.
   * After arriving there, the track is jump to the new index without animation, mainly for loop mode.
   *
   * @param {number}  destIndex - A destination index.
   *                              This can be negative or greater than slides length for reaching clones.
   * @param {number}  newIndex  - An actual new index. They are always same in Slide and Rewind mode.
   * @param {boolean} silently  - If true, suppress emitting events.
   */
  go(destIndex, newIndex, silently: boolean = false) {
    const newPosition = this.getTrimmedPosition(destIndex);
    const prevIndex = this.swiperInstance.index;

    if (!silently) {
      this.swiperInstance.emit('move', newIndex, prevIndex, destIndex);
    }

    if (Math.abs(newPosition - this.currPosition) >= 1 || this.isFade) {
      this.transition.start(destIndex, newIndex, prevIndex, this.toCoord(newPosition), () => {
        this.end(destIndex, newIndex, prevIndex, silently);
      });
    } else {
      if (destIndex !== prevIndex && this.swiperInstance.options.trimSpace === 'move') {
        this.controller.go(destIndex + destIndex - prevIndex, silently);
      } else {
        this.end(destIndex, newIndex, prevIndex, silently);
      }
    }
  }

  /**
   * Called whenever slides arrive at a destination.
   *
   * @param {number}  destIndex - A destination index.
   * @param {number}  newIndex  - A new index.
   * @param {number}  prevIndex - A previous index.
   * @param {boolean} silently  - If true, suppress emitting events.
   */
  end(destIndex: number, newIndex: number, prevIndex: number, silently?: boolean) {
    applyStyle(this.list, { transition: '' });

    if (!this.isFade) {
      this.jump(newIndex);
    }

    if (!silently) {
      this.swiperInstance.emit('moved', newIndex, prevIndex, destIndex);
    }
  }

  /**
   * Move the track to the specified index.
   *
   * @param {number} index - A destination index where the track jumps.
   */
  jump(index) {
    this.translate(this.getTrimmedPosition(index));
  }

  /**
   * Set position.
   *
   * @param {number} position - A new position value.
   */
  translate(position) {
    this.currPosition = position;

    applyStyle(this.list, { transform: `translate${this._direction.axis}(${position}px)` });
  }

  /**
   * Trim redundant spaces on the left or right edge if necessary.
   *
   * @param {number} position - Position value to be trimmed.
   *
   * @return {number} - Trimmed position.
   */
  trim(position) {
    // if ( ! Splide.options.trimSpace || Splide.is( LOOP ) ) {
    if (true) {
      return position;
    }

    // return this._s.trim( position );
  }

  /**
   * Return coordinates object by the given position.
   *
   * @param position - A position value.
   *
   * @return - A coordinates object.
   */
  toCoord(position) {
    return {
      x: this.isVertical ? 0 : position,
      y: this.isVertical ? position : 0,
    };
  }

  /**
   * Return current position.
   *
   * @return Current position.
   */
  get position(): number {
    return this.currPosition;
  }

  /**
   * Convert index to the trimmed position.
   *
   * @return {number} - Trimmed position.
   */
  getTrimmedPosition(index) {
    return this.trim(this._direction.toPosition(index));
  }
}
