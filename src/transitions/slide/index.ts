import ControllerComponent from '../../components/controller/controller.component';
import TrackComponent from '../../components/track/track.component';
import { applyStyle } from '../../utils/dom';
import Virchual, { VirchualComponents, VirchualOptions } from '../../virchual';
import { BaseComponent } from './../../components/base-component';

export class SlideTransition implements BaseComponent {
  /**
   * Hold the list element.
   */
  private list: HTMLElement;

  /**
   * Hold the onEnd callback function.
   */
  private endCallback: Function;

  private track: TrackComponent;
  private swiperInstance: Virchual;
  private controller: ControllerComponent;

  constructor(private options: VirchualOptions) {}

  mount(instance: Virchual, components: VirchualComponents) {
    this.swiperInstance = instance;
    this.controller = components.Controller as ControllerComponent;
    this.track = components.Track as TrackComponent;

    this.list = this.track.list;

    this.swiperInstance.on(
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
   * @param newIndex  - New index.
   * @param prevIndex - Previous index.
   * @param coord     - Destination coordinates.
   * @param done      - Callback function must be invoked when transition is completed.
   */
  start(newIndex: number, prevIndex: number, coord: { x: number; y: number }, done: Function) {
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
