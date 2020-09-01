import { ComponentConstructor } from './components/component';
import { Drag } from './drag';
import { Pagination } from './pagination';
import { Slide } from './slide';
import { identity, Sign } from './types';
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
  frame: HTMLElement;
  currentIndex = 0;

  private slides: Slide[] = [];
  private eventBus: Event;
  private isBusy = false;
  private pagination: Pagination;

  private eventBindings: {
    onClick: () => identity;
    onDrag: () => identity;
    onDragEnd: () => identity;
  };

  constructor(public container: HTMLElement, public settings: VirchualSettings = {}) {
    this.frame = this.container.querySelector('.virchual__frame');

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
    };

    let rawSlides;

    const slides = this.settings['slides'];

    if (typeof slides === 'function') {
      rawSlides = slides();
    } else {
      rawSlides = slides;
    }

    this.slides = this.hydrate();

    this.slides = this.slides.concat((rawSlides || []).map(slide => new Slide(slide, this.frame, this.settings)));

    this.pagination = new Pagination(this.container, this.slides.length);

    this.pagination.render();
  }

  /**
   * Register component class.
   *
   * @param cls Component class.
   * @param settings Optional settings.
   */
  register<T, U>(cls: ComponentConstructor<T, U>, settings?: U) {
    new cls({ virchual: this, eventBus: this.eventBus }, settings);
  }

  /**
   * Mount components.
   */
  mount() {
    console.debug('[Mount] Virchual');

    this.eventBus.emit('mounted');

    this.mountAndUnmountSlides();

    this.bindEvents();

    new Drag(this.frame, { event: this.eventBus }).mount();
  }

  /**
   * Disable Virchual instance and all user interactions (changing slides)
   *
   * @TODO
   */
  disable() {
    return;
  }

  /**
   * Enable previously disabled Virchual instance. Enable user interaction.
   *
   * @TODO
   */
  enable() {
    return;
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
  on(events: string, handler: identity) {
    this.eventBus.on(events, handler);
  }

  /**
   * Unsubscribe the given event.
   *
   * @param events - A event name.
   * @param elm    - Optional. removeEventListener() will be called when this arg is provided.
   */
  off(events: string) {
    this.eventBus.off(events);
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

  /**
   * Destroy instance, remove DOM events.
   */
  destroy() {
    this.eventBus.destroy();

    this.eventBus.emit('destroy');
  }

  private goTo(control: 'prev' | 'next') {
    const slide = this.slides[this.currentIndex];

    slide.translate(-100, {
      easing: true,
      done: () => {
        this.isBusy = false;
      },
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
    const window = this.settings['window'];

    const mountableSlideIndices = slidingWindow(indices, this.currentIndex, window);
    const mountableSlideIndicesWithOffset = slidingWindow(indices, this.currentIndex, window + 1);

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

      slide.set('position', (window - realIndex) * -100);

      const prepend = control === 'prev' || (control == null && this.slides[0].isMounted && realIndex - window < 0);

      slide.mount(prepend);
    });
  }

  private bindEvents() {
    this.eventBus.on('drag', this.eventBindings.onDrag);
    this.eventBus.on('dragend', this.eventBindings.onDragEnd);
    this.eventBus.on('click', this.eventBindings.onClick, this.frame, { capture: true });
  }

  /**
   * Called when frame is clicked.
   *
   * @param event A click event.
   */
  private onClick(event: MouseEvent) {
    this.isBusy && stop(event);
  }

  /**
   * Handle drag event.
   *
   * @param event
   */
  private onDrag(event: { offset: { x: number; y: number }; control: 'prev' | 'next' }) {
    this.isBusy = true;

    const mountableSlideIndices = slidingWindow(range(0, this.slides.length - 1), this.currentIndex, this.settings['window']);

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
