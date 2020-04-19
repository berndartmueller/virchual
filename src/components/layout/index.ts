import { Event } from './../../core/event';
import { applyStyle } from '../../utils/dom';
import VirtualComponent from '../virtual/virtual.component';
import TrackComponent from '../track/track.component';
import { unit } from '../../utils/utils';
import { throttle } from '../../utils/time';
import VirtualSwiper, { VirtualSwiperOptions, VirtualSwiperComponents } from '../../virtual-swiper';
import { BaseComponent } from '../base-component';

/**
 * Interval time for throttle.
 *
 * @type {number}
 */
const THROTTLE = 100;

export abstract class BaseLayout implements BaseComponent {
  protected swiperInstance: VirtualSwiper;
  protected track: TrackComponent;
  protected virtual: VirtualComponent;

  constructor(protected options: VirtualSwiperOptions) {}

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

  mount(instance: VirtualSwiper, components: VirtualSwiperComponents) {
    this.swiperInstance = instance;
    this.virtual = components.Virtual as VirtualComponent;
    this.track = components.Track as TrackComponent;

    this.bind();
    this.init();
  }

  private init() {
    this.initLayout();

    applyStyle(this.swiperInstance.root, { maxWidth: unit(this.options.width) });

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
    this.swiperInstance.on(
      'resize load',
      throttle(() => {
        this.swiperInstance.emit('resize');
      }, THROTTLE),
      window,
    );
    this.swiperInstance.on('resize', this.onResize.bind(this));
    this.swiperInstance.on('updated refresh cloned', this.init.bind(this));
    this.swiperInstance.on('add', this.onResizeSlide.bind(this));
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
        width: this.options.autoWidth ? null : unit(this.slideWidth(slide.index)),
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
      width: this.options.autoWidth ? null : unit(this.slideWidth(slide.index)),
      height: slide.container ? null : slideHeight,
    });
  }
}
