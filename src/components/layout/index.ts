import { applyStyle } from '../../utils/dom';
import { throttle } from '../../utils/throttle';
import { unit } from '../../utils/utils';
import Virchual, { VirchualComponents, VirchualOptions } from '../../virchual';
import { BaseComponent } from '../base-component';
import TrackComponent from '../track/track.component';
import VirtualComponent from '../virtual/virtual.component';

/**
 * Interval time for throttle.
 */
const THROTTLE = 100;

export abstract class BaseLayout implements BaseComponent {
  protected instance: Virchual;
  protected track: TrackComponent;
  protected virtual: VirtualComponent;

  constructor(protected options: VirchualOptions) {}

  abstract initLayout();
  abstract get listWidth(): number;
  abstract get listHeight(): number;
  abstract get slideHeight(): number;
  abstract slideWidth(index?: number): number;
  abstract get height(): number;
  abstract get margin(): string;
  abstract get gap(): number;
  abstract totalWidth(index: number): number;
  abstract get width(): number;

  mount(instance: Virchual, components: VirchualComponents) {
    this.instance = instance;
    this.virtual = components.Virtual as VirtualComponent;
    this.track = components.Track as TrackComponent;

    this.bind();
    this.init();
  }

  private init() {
    this.initLayout();

    applyStyle(this.instance.root, { maxWidth: unit(this.options.width) });

    this.virtual.each(slide => {
      slide.slide.style[this.margin] = unit(this.gap);
    });

    this.onResize();
  }

  /**
   * Listen the resize native event with throttle.
   * Initialize when the component is mounted or options are updated.
   */
  private bind() {
    this.instance.on(
      'resize load',
      throttle(() => {
        this.instance.emit('resize');
      }, THROTTLE),
      window,
    );
    this.instance.on('resize', this.onResize.bind(this));
    this.instance.on('updated refresh cloned moved', this.init.bind(this));
    this.instance.on('add', this.onResizeSlide.bind(this));
  }

  /**
   * Resize the list and slides including clones.
   */
  private onResize() {
    applyStyle(this.track.list, { width: unit(this.listWidth), height: unit(this.listHeight) });
    // applyStyle(this.track.list, { height: unit(this.height) });

    const slideHeight = unit(this.slideHeight);

    this.virtual.each(slide => {
      applyStyle(slide.container, { height: slideHeight });

      applyStyle(slide.slide, {
        width: unit(this.slideWidth(slide.index)),
        height: slide.container ? null : slideHeight,
      });
    });
  }

  /**
   * Resize slide
   */
  private onResizeSlide(index: number) {
    const slide = this.virtual.getSlide(index, false);

    if (slide == null) {
      return;
    }

    applyStyle(this.track.list, { width: unit(this.listWidth), height: unit(this.listHeight) });

    const slideHeight = unit(this.slideHeight);

    applyStyle(slide.slide, {
      width: unit(this.slideWidth(slide.index)),
      height: slide.container ? null : slideHeight,
    });
  }
}
