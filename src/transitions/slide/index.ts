import ControllerComponent from '../../components/controller/controller.component';
import TrackComponent from '../../components/track/track.component';
import { applyStyle } from '../../utils/dom';
import Virchual, { VirchualComponents, VirchualOptions } from '../../virchual';
import { BaseComponent } from './../../components/base-component';
import VirtualComponent from '../../components/virtual/virtual.component';

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
  private instance: Virchual;
  private virtual: VirtualComponent;

  constructor(private options: VirchualOptions) {}

  mount(instance: Virchual, components: VirchualComponents) {
    this.instance = instance;
    this.track = components.Track as TrackComponent;
    this.virtual = components.Virtual as VirtualComponent;

    this.list = this.track.list;

    this.instance.on(
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
   * @param value
   * @param done      - Callback function must be invoked when transition is completed.
   */
  start(value: number, done: Function) {
    const options = this.options;
    let speed = options.speed;

    this.endCallback = done;

    this.virtual.getSlides().forEach(slide => {
      applyStyle(slide.slide, {
        transition: `transform ${speed}ms ${options.easing}`,
        transform: `translate3d(${value}%,0px,0px)`,
      });
    });
  }
}
