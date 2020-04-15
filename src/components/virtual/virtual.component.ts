import { SlideComponent } from './slide.component';
import VirtualSwiper, { VirtualSwiperOptions, VirtualSwiperComponents } from './../../virtual-swiper';
import { BaseComponent } from './../base-component';
import { domify, append } from '../../utils/dom';
import TrackComponent from '../track/track.component';

export default class VirtualComponent implements BaseComponent {
  private slides: string[];
  private virtualSlides: SlideComponent[];
  private track: TrackComponent;
  private swiperInstance: VirtualSwiper;

  constructor(private options: VirtualSwiperOptions) {}

  mount(instance: VirtualSwiper, components: VirtualSwiperComponents) {
    this.swiperInstance = instance;
    this.track = components.Track as TrackComponent;

    this.init();
  }

  get total() {
    return this.slides.length;
  }

  /**
   * Return slides length without clones.
   *
   * @return Slide length.
   */
  get length() {
    return this.slides.length;
  }

  getSlide(index: number) {
    return this.virtualSlides.filter((slide, slideIndex) => slideIndex === index)[0];
  }

  getSlides() {
    return this.virtualSlides;
  }

  each(callback: (slide: SlideComponent) => void) {
    this.virtualSlides.forEach(callback);
  }

  private init() {
    this.virtualSlides = [];

    if (typeof this.options.slides === 'function') {
      this.slides = this.options.slides();
    } else {
      this.slides = this.options.slides;
    }

    this.slides.slice(0, 3).forEach((slide, index) => {
      const node = domify(`<div class='vswiper-slide'>${slide}</div>`);

      append(this.track.list, node);

      this.register(node, index, -1);
    });
  }

  /**
   * Register a slide to create a Slide object and handle its behavior.
   *
   * @param slide     - A slide element.
   * @param index     - A unique index. This can be negative.
   * @param realIndex - A real index for clones. Set -1 for real slides.
   */
  private register(slide: HTMLElement, index: number, realIndex: number) {
    const slideInstance = new SlideComponent(this.options, index, realIndex, slide);

    slideInstance.mount(this.swiperInstance, { Track: this.track });

    this.virtualSlides.push(slideInstance);
  }
}
