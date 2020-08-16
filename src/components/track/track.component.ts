import { applyStyle } from '../../utils/dom';
import ControllerComponent from '../controller/controller.component';
import { SlideTransition } from './../../transitions/slide/index';
import Virchual, { VirchualComponents, VirchualOptions } from './../../virchual';
import { BaseComponent } from './../base-component';
import { HorizontalDirection } from './directions/horizontal';

export default class TrackComponent implements BaseComponent {
  // Store the current position.
  private currPosition: number = 0;

  // Whether the current direction is vertical or not.
  private isVertical: boolean = false;

  private instance: Virchual;
  private controller: ControllerComponent;
  private _direction: HorizontalDirection;
  private _list: HTMLElement;
  private _track: HTMLElement;
  private transition: SlideTransition;

  constructor(private options: VirchualOptions) {}

  get direction() {
    return this._direction;
  }

  get list() {
    return this._list;
  }

  get track() {
    return this._track;
  }

  mount(instance: Virchual, components: VirchualComponents) {
    this.instance = instance;
    this.controller = components.Controller as ControllerComponent;
    this.transition = components.Transition as SlideTransition;
    this._direction = new HorizontalDirection(this.options, instance, components);

    this._track = this.instance.root.querySelector('.virchual__track');
    this._list = this.instance.root.querySelector('.virchual__list');
  }

  /**
   * Called after the component is mounted.
   * The resize event must be registered after the Layout's one is done.
   */
  mounted() {
    this.instance.on('mounted resize updated', () => {
      this.jump(this.instance.index);
    });
  }

  /**
   * Go to the given destination index.
   * After arriving there, the track is jump to the new index without animation, mainly for loop mode.
   *
   * @param destIndex - A destination index.
   *                              This can be negative or greater than slides length for reaching clones.
   * @param newIndex  - An actual new index. They are always same in Slide and Rewind mode.
   * @param silently  - If true, suppress emitting events.
   */
  go(destIndex: number, newIndex: number, silently: boolean = false) {
    const newPosition = this.getTrimmedPosition(destIndex);
    const prevIndex = this.instance.index;

    if (!silently) {
      this.instance.emit('move', newIndex, prevIndex, destIndex);
    }

    if (Math.abs(newPosition - this.currPosition) >= 1) {
      this.transition.start(newIndex, prevIndex, this.toCoord(newPosition), () => {
        this.end(destIndex, newIndex, prevIndex, silently);
      });
    } else {
      if (destIndex !== prevIndex && this.instance.options.trimSpace === 'move') {
        this.controller.go(destIndex + destIndex - prevIndex, silently);
      } else {
        this.end(destIndex, newIndex, prevIndex, silently);
      }
    }
  }

  /**
   * Called whenever slides arrive at a destination.
   *
   * @param destIndex - A destination index.
   * @param newIndex  - A new index.
   * @param prevIndex - A previous index.
   * @param silently  - If true, suppress emitting events.
   */
  end(destIndex: number, newIndex: number, prevIndex: number, silently?: boolean) {
    applyStyle(this.list, { transition: '' });

    this.jump(newIndex);

    if (!silently) {
      this.instance.emit('moved', newIndex, prevIndex, destIndex);
    }
  }

  /**
   * Move the track to the specified index.
   *
   * @param index - A destination index where the track jumps.
   */
  jump(index: number) {
    this.translate(this.getTrimmedPosition(index));
  }

  /**
   * Set position.
   *
   * @param position - A new position value.
   */
  translate(position: number) {
    this.currPosition = position;

    applyStyle(this.list, { transform: `translate${this._direction.axis}(${position}px)` });
  }

  /**
   * Trim redundant spaces on the left or right edge if necessary.
   *
   * @param position - Position value to be trimmed.
   *
   * @return Trimmed position.
   */
  trim(position: number): number {
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
  toCoord(position: number) {
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
   * @return Trimmed position.
   */
  getTrimmedPosition(index: number): number {
    return this.trim(this._direction.toPosition(index));
  }
}
