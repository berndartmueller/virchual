import { Slide } from './components2/slide';
import { Event } from './core/event';
import { exist } from './utils/error';
import { find } from './utils/dom';
import { Drag } from './components2/drag';
import { rewind, range } from './utils/utils';
import { slidingWindow } from './utils/sliding-window';
import './css/styles.css';

export type VirchualOptions = {
  slides?: string[] | (() => string[]);
  speed?: number;
  easing?: string;
  swipeDistanceThreshold?: number;
  flickVelocityThreshold?: number;
  flickPower?: number;
  pagination?: boolean;
  window?: number;
};

export class Virchual {
  container: HTMLElement;
  frame: HTMLElement;
  frameWidth: number;
  currentIndex: number = 0;
  slides: Slide[] = [];

  private event: Event;

  // bound event handlers (to keep `this` context)
  private eventBindings: {
    onDrag: () => {};
    onDragged: () => {};
    onKeyUp: () => {};
  };

  constructor(public selector: HTMLElement | string, public options: VirchualOptions = {}) {
    this.container = selector instanceof Element ? selector : find(document, selector);
    this.frame = this.container.querySelector('.virchual__frame');

    exist(this.frame, 'Invalid element/selector');

    this.currentIndex = 0;
    this.options = {
      slides: [],
      speed: 400,
      swipeDistanceThreshold: 150,
      flickVelocityThreshold: 0.6,
      flickPower: 600,
      easing: 'cubic-bezier(.42,.65,.27,.99)',
      pagination: true,
      window: 1,
      ...options,
    };

    this.event = new Event();

    this.eventBindings = {
      onDrag: this.onDrag.bind(this),
      onKeyUp: this.onKeyUp.bind(this),
      onDragged: this.onDragged.bind(this),
    };

    let rawSlides;

    if (typeof this.options.slides === 'function') {
      rawSlides = this.options.slides();
    } else {
      rawSlides = this.options.slides;
    }

    this.slides = (rawSlides || []).map((slide, index) => new Slide(slide, this.frame));

    this.resize();
    this.mount();

    new Drag(this.frame, this.options, { event: this.event }).start();

    this.bindEvents();
  }

  /**
   * Register callback fired on the given event(s).
   *
   * @param events  - An event name. Use space to separate multiple events.
   *                             Also, namespace is accepted by dot, such as 'resize.{namespace}'.
   * @param handler - A callback function.
   * @param elm     - Optional. Native event will be listened to when this arg is provided.
   * @param options - Optional. Options for addEventListener.
   */
  on(events: string, handler: any, elm: (Window & typeof globalThis) | Element = null, options: object = {}) {
    this.event.on(events, handler, elm, options);
  }

  /**
   * Unsubscribe the given event.
   *
   * @param events - A event name.
   * @param elm    - Optional. removeEventListener() will be called when this arg is provided.
   */
  off(events: string, elm: (Window & typeof globalThis) | Element = null) {
    this.event.off(events, elm);
  }

  previous() {}

  next() {}

  private mount() {
    this.event.emit('mounted');

    this.runSlidesLifecycle();
  }

  private resize() {
    this.frameWidth = this.frame.getBoundingClientRect().width;
  }

  /**
   * Mount and unmount slides.
   */
  private runSlidesLifecycle({ direction }: { direction?: 'prev' | 'next' } = {}) {
    const currentSlide = this.slides[this.currentIndex];

    const mountableSlideIndices = slidingWindow(range(0, this.slides.length - 1), this.currentIndex, this.options.window);
    const mountableSlideIndicesWithOffset = slidingWindow(range(0, this.slides.length - 1), this.currentIndex, this.options.window + 1);

    mountableSlideIndicesWithOffset.forEach(index => {
      const slide = this.slides[index];

      if (index === this.currentIndex) {
        currentSlide.isActive = true;
      } else {
        this.slides[this.currentIndex].isActive = false;
      }

      let realIndex = mountableSlideIndices.indexOf(index);

      // unmount
      if (realIndex < 0) {
        return slide.unmount();
      }

      slide.position = (this.options.window - realIndex) * -100;
      console.log('slide position', slide.position, 'realIndex', realIndex, this.currentIndex);

      const prepend = direction === 'prev';

      slide.mount(prepend);
    });
  }

  private bindEvents() {
    this.event.on('keyup', this.eventBindings.onKeyUp, window);
    this.event.on('drag', this.eventBindings.onDrag);
    this.event.on('dragged', this.eventBindings.onDragged);
  }

  private unbindEvents() {
    window.removeEventListener('keyup', this.eventBindings.onKeyUp);
  }

  /**
   * Handle drag event.
   *
   * @param event
   */
  private onDrag(event: { offset: { x: number; y: number }; direction: 'prev' | 'next' }) {
    const mountableSlideIndices = slidingWindow(range(0, this.slides.length - 1), this.currentIndex, this.options.window);

    const sign = event.direction === 'prev' ? +1 : -1;

    mountableSlideIndices.forEach(index => {
      const slide = this.slides[index];

      const x = sign * Math.abs(event.offset.x);

      slide.translate(x);
    });
  }

  /**
   * Handle dragged event.
   *
   * @param event
   */
  private onDragged(event: { direction: 'prev' | 'next' }) {
    console.debug('[Drag] Drag end', event);

    const slide = this.slides[this.currentIndex];

    slide.translate(-100);

    const sign = event.direction === 'prev' ? -1 : +1;

    this.currentIndex = rewind(this.currentIndex + sign * 1, this.slides.length - 1);

    this.runSlidesLifecycle({ direction: event.direction });
  }

  private onKeyUp(event: KeyboardEvent) {
    switch (event.which) {
      // arrow left
      case 37:
        this.previous();
        break;

      // arrow right
      case 39:
        this.next();
    }
  }
}

[].forEach.call(document.querySelectorAll('.image-swiper'), (slider: HTMLElement) => {
  new Virchual(slider, {
    slides: () => {
      const slides: string[] = [];

      for (let i = 0; i < 10; i++) {
        slides.push(`<span>Slide ${i + 1}</span>`);
      }

      return slides;
    },
  });
});
