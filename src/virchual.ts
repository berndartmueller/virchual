import './css/styles.css';
import { Drag } from './drag';
import { Pagination } from './pagination';
import { Slide } from './slide';
import { Sign, identity } from './types';
import { assert } from './utils/error';
import { Event, stop } from './utils/event';
import { slidingWindow } from './utils/sliding-window';
import { range, rewind } from './utils/utils';

export type VirchualSettings = {
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
  paginationButtons: HTMLButtonElement[];
  currentIndex = 0;

  private slides: Slide[] = [];
  private eventBus: Event;
  private isBusy = false;
  private pagination: Pagination;

  private eventBindings: {
    onClick: () => identity;
    onDrag: () => identity;
    onDragEnd: () => identity;
    onPaginationButtonClick: () => identity;
  };

  constructor(element: HTMLElement | string, public settings: VirchualSettings = {}) {
    this.container = element instanceof Element ? element : document.querySelector(element);
    this.frame = this.container.querySelector('.virchual__frame');
    this.paginationButtons = [].slice.call(this.container.querySelectorAll('.virchual__control'));

    assert(this.frame, 'Invalid element');

    this.currentIndex = 0;
    this.settings = {
      slides: [],
      speed: 200,
      swipeDistanceThreshold: 150,
      flickVelocityThreshold: 0.6,
      flickPower: 600,
      easing: 'ease-out',
      pagination: true,
      window: 1,
      ...settings,
    };

    this.eventBus = new Event();

    this.eventBindings = {
      onClick: this.onClick.bind(this),
      onDrag: this.onDrag.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onPaginationButtonClick: this.onPaginationButtonClick.bind(this),
    };

    let rawSlides;

    if (typeof this.settings.slides === 'function') {
      rawSlides = this.settings.slides();
    } else {
      rawSlides = this.settings.slides;
    }

    this.slides = this.hydrate();

    this.slides = this.slides.concat((rawSlides || []).map(slide => new Slide(slide, this.frame, this.settings)));

    this.bindEvents();

    new Drag(this.frame, { event: this.eventBus }).mount();
    this.pagination = new Pagination(this.container, this.slides.length);

    this.pagination.render();
  }

  /**
   * Mount components.
   */
  mount() {
    this.eventBus.emit('mounted');

    this.mountAndUnmountSlides();
  }

  /**
   * Unmount components and cleanup events.
   */
  unmount() {
    this.eventBus.destroy();

    this.eventBus.emit('unmounted');
  }

  /**
   * Register callback fired on the given event(s).
   *
   * @param events An event name. Use space to separate multiple events.
   *                             Also, namespace is accepted by dot, such as 'resize.{namespace}'.
   * @param handler A callback function.
   * @param elm  Optional. Native event will be listened to when this arg is provided.
   * @param opts Optional. Options for addEventListener.
   */
  on(events: string, handler: identity, elm: (Window & typeof globalThis) | Element = null, opts: Record<string, unknown> = {}) {
    this.eventBus.on(events, handler, elm, opts);
  }

  /**
   * Unsubscribe the given event.
   *
   * @param events - A event name.
   * @param elm    - Optional. removeEventListener() will be called when this arg is provided.
   */
  off(events: string, elm: (Window & typeof globalThis) | Element = null) {
    this.eventBus.off(events, elm);
  }

  /**
   * Go to previous slide.
   */
  prev() {
    console.debug('[Controls] Previous');

    this.goTo('prev');
  }

  /**
   * Go to next slide.
   */
  next() {
    console.debug('[Controls] Next');

    this.goTo('next');
  }

  private goTo(control: 'prev' | 'next') {
    const slide = this.slides[this.currentIndex];

    slide.translate(-100, () => {
      this.isBusy = false;
    });

    const sign: Sign = control === 'prev' ? -1 : +1;

    this.currentIndex = rewind(this.currentIndex + sign * 1, this.slides.length - 1);

    this.mountAndUnmountSlides({ control: control });

    const move = control === 'prev' ? this.pagination.prev.bind(this.pagination) : this.pagination.next.bind(this.pagination);

    move();
  }

  private hydrate(): Slide[] {
    const slideElements = [].slice.call(this.frame.querySelectorAll('div')) as HTMLDivElement[];

    return slideElements.map(element => new Slide(element, this.frame, this.settings));
  }

  /**
   * Mount and unmount slides.
   */
  private mountAndUnmountSlides({ control }: { control?: 'prev' | 'next' } = {}) {
    const currentSlide = this.slides[this.currentIndex];
    const indices = range(0, this.slides.length - 1);

    const mountableSlideIndices = slidingWindow(indices, this.currentIndex, this.settings.window);
    const mountableSlideIndicesWithOffset = slidingWindow(indices, this.currentIndex, this.settings.window + 1);

    mountableSlideIndicesWithOffset.forEach(index => {
      const slide = this.slides[index];

      if (index === this.currentIndex) {
        currentSlide.set('isActive', true);
      } else {
        currentSlide.set('isActive', false);
      }

      const realIndex = mountableSlideIndices.indexOf(index);

      // unmount
      if (realIndex < 0) {
        return slide.unmount();
      }

      slide.set('position', (this.settings.window - realIndex) * -100);

      const prepend = control === 'prev' || (control == null && this.slides[0].isMounted && realIndex - this.settings.window < 0);

      slide.mount(prepend);
    });
  }

  private bindEvents() {
    this.eventBus.on('drag', this.eventBindings.onDrag);
    this.eventBus.on('dragend', this.eventBindings.onDragEnd);
    this.eventBus.on('click', this.eventBindings.onClick, this.frame, { capture: true });

    this.paginationButtons.forEach(button => this.eventBus.on('click', this.eventBindings.onPaginationButtonClick, button));
  }

  /**
   * Called when frame is clicked.
   *
   * @param event A click event.
   */
  private onClick(event: MouseEvent) {
    this.isBusy && stop(event);
  }

  private onPaginationButtonClick(event: MouseEvent) {
    const button: HTMLButtonElement = (event.target as Element).closest('button') as HTMLButtonElement;
    const control = button.dataset.controls as 'prev' | 'next';

    const move = control === 'prev' ? this.prev.bind(this) : this.next.bind(this);

    move();
  }

  /**
   * Handle drag event.
   *
   * @param event
   */
  private onDrag(event: { offset: { x: number; y: number }; control: 'prev' | 'next' }) {
    this.isBusy = true;

    const mountableSlideIndices = slidingWindow(range(0, this.slides.length - 1), this.currentIndex, this.settings.window);

    const sign = event.control === 'prev' ? +1 : -1;

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
  private onDragEnd(event: { control: 'prev' | 'next' }) {
    console.debug('[Drag] Drag end', event);

    this.goTo(event.control);
  }
}
