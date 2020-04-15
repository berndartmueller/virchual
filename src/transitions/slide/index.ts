import { Event } from './../../core/event';
import { BaseComponent } from './../../components/base-component';
import TrackComponent from '../../components/track/track.component';
import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from '../../virtual-swiper';
import { applyStyle } from '../../utils/dom';
import ControllerComponent from '../../components/controller/controller.component';

export class SlideTransition implements BaseComponent {
  /**
   * Hold the list element.
   *
   * @type {Element}
   */
  private list;

  /**
   * Hold the onEnd callback function.
   *
   * @type {function}
   */
  private endCallback;

  private track: TrackComponent;
  private controller: ControllerComponent;

  constructor(private options: VirtualSwiperOptions) {}

  mount(instance: VirtualSwiper, components: VirtualSwiperComponents) {
    this.controller = components.Controller as ControllerComponent;
    this.track = components.Track as TrackComponent;

    this.list = this.track.list;

    Event.on(
      'transitionend',
      e => {
        if (e.target === this.list && this.endCallback) {
          this.endCallback();
        }
      },
      this.list,
    );
  }

  /**
   * Start transition.
   *
   * @param {number}   destIndex - Destination slide index that might be clone's.
   * @param {number}   newIndex  - New index.
   * @param {number}   prevIndex - Previous index.
   * @param {Object}   coord     - Destination coordinates.
   * @param {function} done      - Callback function must be invoked when transition is completed.
   */
  start(destIndex, newIndex, prevIndex, coord, done) {
    const options = this.options;
    const edgeIndex = this.controller.edgeIndex;
    let speed = options.speed;

    this.endCallback = done;

    if ((prevIndex === 0 && newIndex >= edgeIndex) || (prevIndex >= edgeIndex && newIndex === 0)) {
      speed = options.rewindSpeed || speed;
    }

    applyStyle(this.list, {
      transition: `transform ${speed}ms ${options.easing}`,
      transform: `translate(${coord.x}px,${coord.y}px)`,
    });
  }
}
