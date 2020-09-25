import { ComponentConstructor } from './components/component';
import { ELEMENT_CLASSES, NEXT, PREV } from './constants';
import { Drag } from './drag';
import { Pagination } from './pagination';
import { Slide } from './slide';
import { Direction, identity, Sign } from './types';
import { map } from './utils/dom';
import { Event, stop } from './utils/event';
import { slidingWindow } from './utils/sliding-window';
import { range, rewind } from './utils/utils';

export type VirchualSettings = {
  slides?: () => string[];
  speed?: number;
  easing?: string;
  pagination?: boolean;
  window?: number;
};

function getSlideByIndex(index: number, slides: Slide[]): Slide {
  const slide = slides.find(slide => slide.idx === index);

  return slide || slides[index];
}

export class Virchual {
  frame: HTMLElement;
  index = 0;

  private _slides: Slide[] = [];
  private _virtualSlidesWindowPrevious: number[] = [];
  private _eventBus: Event;
  private _isMounted = false;
  private _isBusy = false;
  private _isDragging = false;
  private _isEnabled = true;
  private _pagination: Pagination;

  constructor(public container: HTMLElement, public settings: VirchualSettings = {}) {
    this.frame = this.container.querySelector(`.${ELEMENT_CLASSES._frame}`);

    this.index = 0;
    this.settings = {
      slides: null,
      speed: 200,
      easing: 'ease-out',
      pagination: true,
      window: 1,
      ...settings,
    };

    this._eventBus = new Event();

    this._slides = [...this._hydrate(), ...this._initSlides()];
    this._slides = [...this._slides, ...this._createClones()];

    this.settings.window = Math.min(this.settings.window, Math.max(this._getSlidesLength() - 1, 0));

    this._pagination = new Pagination(this.container, this._getSlidesLength(), { isActive: this.settings.pagination });
    this._pagination.render();
  }

  /**
   * Return all slides.
   *
   * @param includeClones Whether to include cloned slides or not.
   * @return Slide objects.
   */
  getSlides(includeClones = false): Slide[] {
    return includeClones ? this._slides : this._slides.filter(slide => !slide.isClone);
  }

  /**
   * Register component class.
   *
   * @param cls Component class.
   * @param settings Optional settings.
   */
  register<T, U>(cls: ComponentConstructor<T, U>, settings?: U) {
    new cls(this._getImports(), settings);
  }

  /**
   * Mount components.
   */
  mount() {
    if (this._getSlidesLength() < 2 || this._isMounted) {
      return;
    }

    console.debug('[Mount] Virchual');

    this._mountAndUnmountSlides();

    this._bindEvents();

    new Drag(this.frame, { event: this._eventBus }).mount();

    this._eventBus.emit('mounted');
    this._isMounted = true;
  }

  /**
   * Disable Virchual instance and all user interactions (changing slides)
   */
  disable() {
    this._isEnabled = false;
  }

  /**
   * Enable previously disabled Virchual instance. Enable user interaction.
   */
  enable() {
    this._isEnabled = true;
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
    this._eventBus.on(events, handler);
  }

  /**
   * Unsubscribe the given event.
   *
   * @param events An event name.
   * @param handler Event handler callback.
   */
  off(events: string, handler: identity) {
    this._eventBus.off(events, handler);
  }

  /**
   * Go to previous slide.
   */
  prev() {
    if (this._isBusy) {
      return;
    }

    console.debug('[Controls] Previous');

    this._goTo(PREV);
  }

  /**
   * Go to next slide.
   */
  next() {
    if (this._isBusy) {
      return;
    }

    console.debug('[Controls] Next');

    this._goTo(NEXT);
  }

  /**
   * Destroy instance, remove DOM events.
   */
  destroy() {
    this._eventBus.destroy();

    this._eventBus.emit('destroy');
  }

  private _getImports() {
    return {
      virchual: this,
      eventBus: this._eventBus,
    };
  }

  /**
   * Return total number of slides.
   *
   * @param includeClones Whether to include cloned slides or not.
   * @return Total number of slides.
   */
  private _getSlidesLength(includeClones = false): number {
    return this.getSlides(includeClones).length;
  }

  private _goTo(control: Direction) {
    if (!this._isEnabled) {
      return;
    }

    this._isBusy = true;

    const sign: Sign = control === PREV ? -1 : +1;
    const nextIndex = this.index + sign * 1;
    const newIndex = rewind(nextIndex, this._getSlidesLength() - 1);
    const positionX = `${sign * -100}%`;

    const handleGoTo = () => {
      this.index = newIndex;

      this._mountAndUnmountSlides(control);

      const move = control === PREV ? this._pagination.prev.bind(this._pagination) : this._pagination.next.bind(this._pagination);

      move();

      this._eventBus.emit('move', { index: this.index, control });

      this._isBusy = false;
    };

    // delay further processing until movement has finished
    this._move(positionX, sign, { callback: handleGoTo });
  }

  /**
   * Initialize slides.
   */
  private _initSlides(): Slide[] {
    const slides = this.settings.slides && this.settings.slides();

    return (slides || []).map(slide => new Slide(slide, this.frame, this._getImports()));
  }

  /**
   * Hydrate existing slides from DOM.
   */
  private _hydrate(): Slide[] {
    return map(this.frame.children, element => new Slide(element, this.frame, this._getImports())) as Slide[];
  }

  /**
   * Create clones of slides in case there are less slides than window size.
   */
  private _createClones(): Slide[] {
    const slidesLength = this._getSlidesLength();
    const totalSlidingWindowLength = this.settings.window * 2 + 1;
    const clones: Slide[] = [];

    // no need to clones slides
    if (slidesLength >= totalSlidingWindowLength) {
      return clones;
    }

    for (let index = slidesLength - 1; index >= slidesLength - this.settings.window; index--) {
      const slide = this._slides[index];

      const clone = slide.clone();

      clones.push(clone);
    }

    return clones;
  }

  /**
   * Mount and unmount slides.
   */
  private _mountAndUnmountSlides(control?: Direction) {
    const window = this.settings.window;
    const indicesWithoutClones = range(0, this._getSlidesLength() - 1);
    const indices = range(0, this._getSlidesLength(true) - 1);

    const virtualSlidesWindow = slidingWindow(indices, this.index, window);
    const virtualSlidesWindowWithoutClones = slidingWindow(indicesWithoutClones, this.index, window);

    const previousWindowLength = this._virtualSlidesWindowPrevious.length;

    // unmount
    if (previousWindowLength > 0) {
      const index = control === NEXT ? 0 : previousWindowLength - 1;
      const slideIndex = this._virtualSlidesWindowPrevious[index];

      const slide = getSlideByIndex(slideIndex, this._slides);

      slide.unmount();

      if (slide.isClone) {
        this._slides.splice(slideIndex, 1);
      }
    }

    // mount
    virtualSlidesWindow.forEach((slideIndex, index) => {
      let slide = getSlideByIndex(slideIndex, this._slides);
      const centerDistance = index - Math.floor(virtualSlidesWindow.length / 2);
      const prepend = control === PREV || centerDistance < 0;

      // clone new slide
      if (slide == null) {
        const realSlideIndex = virtualSlidesWindowWithoutClones[index];

        slide = this._slides[realSlideIndex].clone();

        this._slides.splice(slideIndex, 0, slide);
      }

      slide.idx = slideIndex;
      slide.set('isActive', slideIndex === this.index).set('position', centerDistance * 100);

      slide.mount(prepend);
    });

    this._virtualSlidesWindowPrevious = virtualSlidesWindow;
  }

  private _bindEvents() {
    this._eventBus.on({ drag: this._onDrag, dragend: this._onDragEnd });
    this._eventBus.on('click', this._onClick, this.frame, { capture: true });
  }

  /**
   * Called when frame is clicked.
   *
   * @param event A click event.
   */
  private _onClick = (event: MouseEvent) => {
    this._isDragging && stop(event);
  };

  /**
   * Handle drag event.
   *
   * @param event
   */
  private _onDrag = (event: { offset: { x: number; y: number }; control: Direction }) => {
    if (!this._isEnabled || this._isBusy) {
      return;
    }

    this._isDragging = true;

    const sign = event.control === PREV ? -1 : +1;
    const positionX = -1 * sign * Math.abs(event.offset.x);

    this._move(`${Math.round(positionX)}px`, sign, { ease: false });
  };

  /**
   * Handle dragged event.
   *
   * @param event
   */
  private _onDragEnd = (event: { control: Direction }) => {
    console.debug('[Drag] Drag end', event);

    this._goTo(event.control);

    this._isDragging = false;
  };

  /**
   * Move slides to their new position.
   *
   * @param positionX New slide position. Unit (px, %,..) has to be given.
   * @param sign Direction. Either -1 or +1.
   * @param callback Callback function which is called after moving has finished.
   */
  private _move(positionX: string, sign: Sign, { ease, callback }: { ease?: boolean; callback?: identity } = {}) {
    const window = this.settings.window;

    let mountableSlideIndices = slidingWindow(range(0, this._getSlidesLength(true) - 1), this.index, window);

    let start = 0;
    let end = window + 1;

    if (sign > 0) {
      start = -1 * end;
      end = undefined;
    }

    mountableSlideIndices = mountableSlideIndices.slice(start, end);

    let callbacksCalled = 0;

    mountableSlideIndices.forEach(slideIndex => {
      const slide = this._slides[slideIndex];

      slide.translate(positionX, {
        ease: ease ?? true,
        done: () => {
          callbacksCalled++;

          if (callback && callbacksCalled === mountableSlideIndices.length) {
            callback();
          }
        },
      });
    });
  }
}
