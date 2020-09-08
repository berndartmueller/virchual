import { ComponentConstructor } from './components/component';
import { Drag } from './drag';
import { Pagination } from './pagination';
import { Slide } from './slide';
import { identity, Sign } from './types';
import { assert } from './utils/error';
import { Event, stop } from './utils/event';
import { slidingWindow } from './utils/sliding-window';
import { range, rewind } from './utils/utils';

type DiffActionMount = {
  type: 'mount';
  centerDistance: number;
};

type DiffActionUnmount = {
  type: 'unmount';
};

type DiffAction = DiffActionMount | DiffActionUnmount;

type Diff = {
  index: number;
  slideIndex: number;
  action: DiffAction;
};

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

export function getSlideByIndex(index: number, slides: Slide[]): Slide {
  return slides.find(slide => slide.idx === index);
}

export class Virchual {
  frame: HTMLElement;
  currentIndex = 0;

  private slides: Slide[] = [];
  private virtualSlidesWindow: number[] = [];
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

    const hydratedSlides = this.hydrate();
    const initializedSlides = this.initSlides();

    this.slides = [...hydratedSlides, ...initializedSlides];

    const clonedSlides = this.createClones();

    this.slides = [...this.slides, ...clonedSlides];

    this.settings['window'] = Math.min(this.settings['window'], Math.max(this.getSlidesLength() - 1, 0));

    this.pagination = new Pagination(this.container, this.getSlidesLength(), { isActive: this.settings.pagination });

    this.pagination.render();
  }

  /**
   * Return all slides.
   *
   * @param includeClones Whether to include cloned slides or not.
   * @return Slide objects.
   */
  getSlides(includeClones = false): Slide[] {
    return includeClones ? this.slides : this.slides.filter(slide => !slide.isClone);
  }

  /**
   * Return total number of slides.
   *
   * @param includeClones Whether to include cloned slides or not.
   * @return Total number of slides.
   */
  getSlidesLength(includeClones = false): number {
    return this.getSlides(includeClones).length;
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
    if (this.getSlidesLength() < 2) {
      return;
    }

    console.debug('[Mount] Virchual');

    this.mountAndUnmountSlides();

    this.bindEvents();

    new Drag(this.frame, { event: this.eventBus }).mount();

    this.eventBus.emit('mounted');
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
    const sign: Sign = control === 'prev' ? -1 : +1;
    const nextIndex = this.currentIndex + sign * 1;
    const newIndex = rewind(nextIndex, this.getSlidesLength() - 1);
    const isRewind = newIndex !== nextIndex;
    const positionX = `${sign * -100}%`;

    const handleGoTo = () => {
      this.isBusy = false;
      this.currentIndex = newIndex;

      this.mountAndUnmountSlides({
        control: control,
      });

      const move = control === 'prev' ? this.pagination.prev.bind(this.pagination) : this.pagination.next.bind(this.pagination);

      move();

      this.eventBus.emit('move', { index: this.currentIndex, control });
    };

    // if rewind necessary, delay further processing until movement has finished
    if (isRewind) {
      this.move(positionX, sign, { callback: handleGoTo });
    } else {
      this.move(positionX, sign);

      handleGoTo();
    }
  }

  /**
   * Initialize slides.
   */
  private initSlides(): Slide[] {
    let rawSlides;

    const slides = this.settings['slides'];

    if (typeof slides === 'function') {
      rawSlides = slides();
    } else {
      rawSlides = slides;
    }

    return (rawSlides || []).map(slide => new Slide(slide, this.frame, { virchual: this, eventBus: this.eventBus }));
  }

  /**
   * Hydrate existing slides from DOM.
   */
  private hydrate(): Slide[] {
    const slideElements = [].slice.call(this.frame.children) as HTMLDivElement[];

    return slideElements.map(element => new Slide(element, this.frame, { virchual: this, eventBus: this.eventBus }));
  }

  /**
   * Create clones of slides in case there are less slides than window size.
   */
  private createClones(): Slide[] {
    const slidesLength = this.getSlidesLength();
    const totalSlidingWindowLength = this.settings['window'] * 2 + 1;
    const clones: Slide[] = [];

    // no need to clones slides
    if (slidesLength >= totalSlidingWindowLength) {
      return clones;
    }

    for (let index = slidesLength - 1; index >= slidesLength - this.settings['window']; index--) {
      const slide = this.slides[index];

      const clone = slide.clone();

      clones.push(clone);
    }

    return clones;
  }

  /**
   * Mount and unmount slides.
   */
  private mountAndUnmountSlides({ control }: { control?: 'prev' | 'next' } = {}) {
    const window = this.settings['window'];
    const indicesWithoutClones = range(0, this.getSlidesLength() - 1);
    const indices = range(0, this.getSlidesLength(true) - 1);

    const virtualSlidesWindow = slidingWindow(indices, this.currentIndex, window);
    const virtualSlidesWindowWithoutClones = slidingWindow(indicesWithoutClones, this.currentIndex, window);

    const diffs = this.diff(virtualSlidesWindow, this.virtualSlidesWindow);

    console.log('DIFF:', diffs);

    console.log('current index -> ', this.currentIndex);

    console.log('virtual slides (old)', this.virtualSlidesWindow);
    console.log('virtual slides (new):', virtualSlidesWindow);
    console.log('virtual slides (new withOUT clones):', virtualSlidesWindowWithoutClones, indicesWithoutClones, this.currentIndex);

    console.log('START ITERATING...', 'control: ', control);
    console.log(' ');

    diffs.forEach(diff => {
      const slideIndex = diff['slideIndex'];
      const realSlideIndex = virtualSlidesWindowWithoutClones[diff.index];
      const isActive = slideIndex === this.currentIndex;
      let slide = getSlideByIndex(slideIndex, this.slides) || this.slides[slideIndex];

      console.log('diff: ', diff);
      console.log('slideIndex:', slideIndex, 'real slide index:', realSlideIndex, slide);

      // mount
      if (diff.action.type === 'mount') {
        const prepend = control === 'prev' || diff.action.centerDistance < 0;

        console.log('prepend?', prepend);

        // clone new slide
        if (slide == null) {
          console.log('clone new slide!', realSlideIndex);
          slide = this.slides[realSlideIndex].clone();

          this.slides.splice(slideIndex, 0, slide);
        }

        slide.idx = slideIndex;
        slide.set('isActive', isActive);
        slide.set('position', diff.action.centerDistance * 100);

        slide.mount(prepend);

        // unmount
      } else {
        slide.unmount();

        if (slide.isClone) {
          console.log('Unmount was clone -> remove!', slide.idx);

          this.slides.splice(slideIndex, 1);
        }
      }
    });

    console.log('STOP ITERATING', this.getSlides(), ', w/ clones:', this.slides);
    console.log(' ');

    this.virtualSlidesWindow = virtualSlidesWindow;
  }

  private diff(current: number[], previous: number[]): Diff[] {
    previous = previous || [];

    const diffs: Diff[] = [
      // unmount
      ...this.calculateDiff(previous, current, (isFound, diff) => {
        if (!isFound) {
          diff.action.type = 'unmount';

          return diff;
        }
      }),

      // mount
      ...this.calculateDiff(current, []),
    ];

    return diffs;
  }

  private calculateDiff(arrayA: number[], arrayB: number[], condition?: (isFound: boolean, diff: Diff) => Diff): Diff[] {
    const diffs: Diff[] = [];

    arrayA.forEach((slideIndex, index) => {
      let diff: Diff = {
        index,
        slideIndex,
        action: {
          type: 'mount',
          centerDistance: index - Math.floor(arrayA.length / 2),
        },
      };

      const left = arrayB[index - 1] - slideIndex;
      const right = arrayB[index + 1] - slideIndex;
      const isFound = left === 0 || right === 0;

      diff = condition != null ? condition(isFound, diff) : diff;

      diff && diffs.push(diff);
    });

    return diffs;
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

    const sign = event.control === 'prev' ? -1 : +1;
    const positionX = -1 * sign * Math.abs(event.offset.x);

    this.move(`${Math.round(positionX)}px`, sign, { easing: false });
  }

  /**
   * Move slides to their new position.
   *
   * @param xPosition New slide position. Unit (px, %,..) has to be given.
   * @param sign Direction. Either -1 or +1.
   * @param callback Callback function which is called after moving has finished.
   */
  private move(xPosition: string, sign: Sign, { easing, callback }: { easing?: boolean; callback?: identity } = {}) {
    let mountableSlideIndices = slidingWindow(range(0, this.getSlidesLength(true) - 1), this.currentIndex, this.settings['window']);

    if (sign > 0) {
      mountableSlideIndices = mountableSlideIndices.slice(-1 * (this.settings['window'] + 1));
    } else {
      mountableSlideIndices = mountableSlideIndices.slice(0, this.settings['window'] + 1);
    }

    mountableSlideIndices.forEach(slideIndex => {
      const slide = this.slides[slideIndex];

      slide.translate(xPosition, {
        easing: easing ?? true,
        done: () => {
          if (callback) {
            callback();

            callback = null;
          }
        },
      });
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
