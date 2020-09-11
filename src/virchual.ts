import { ComponentConstructor } from './components/component';
import { Drag } from './drag';
import { Pagination } from './pagination';
import { Slide } from './slide';
import { identity, Sign, Direction } from './types';
import { map } from './utils/dom';
import { Event, stop } from './utils/event';
import { slidingWindow } from './utils/sliding-window';
import { range, rewind } from './utils/utils';
import { ELEMENT_CLASSES, PREV, NEXT } from './constants';

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
  slides?: () => string[];
  speed?: number;
  easing?: string;
  pagination?: boolean;
  window?: number;
};

export function getSlideByIndex(index: number, slides: Slide[]): Slide {
  return slides.find(slide => slide.idx === index);
}

export class Virchual {
  frame: HTMLElement;
  currentIndex = 0;

  private _slides: Slide[] = [];
  private _virtualSlidesWindow: number[] = [];
  private _eventBus: Event;
  private _isMounted = false;
  private _isBusy = false;
  private _isEnabled = true;
  private _pagination: Pagination;

  constructor(public container: HTMLElement, public settings: VirchualSettings = {}) {
    this.frame = this.container.querySelector(`.${ELEMENT_CLASSES._frame}`);

    this.currentIndex = 0;
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

    this.settings.window = Math.min(this.settings.window, Math.max(this.getSlidesLength() - 1, 0));

    this._pagination = new Pagination(this.container, this.getSlidesLength(), { isActive: this.settings.pagination });
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
    new cls({ virchual: this, eventBus: this._eventBus }, settings);
  }

  /**
   * Mount components.
   */
  mount() {
    if (this.getSlidesLength() < 2 || this._isMounted) {
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
    console.debug('[Controls] Previous');

    this._goTo(PREV);
  }

  /**
   * Go to next slide.
   */
  next() {
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

  private _goTo(control: Direction) {
    if (!this._isEnabled) {
      return;
    }

    const sign: Sign = control === PREV ? -1 : +1;
    const nextIndex = this.currentIndex + sign * 1;
    const newIndex = rewind(nextIndex, this.getSlidesLength() - 1);
    const isRewind = newIndex !== nextIndex;
    const positionX = `${sign * -100}%`;

    const handleGoTo = () => {
      this._isBusy = false;
      this.currentIndex = newIndex;

      this._mountAndUnmountSlides({
        control: control,
      });

      const move = control === PREV ? this._pagination.prev.bind(this._pagination) : this._pagination.next.bind(this._pagination);

      move();

      this._eventBus.emit('move', { index: this.currentIndex, control });
    };

    // if rewind necessary, delay further processing until movement has finished
    if (isRewind) {
      this._move(positionX, sign, { callback: handleGoTo });
    } else {
      this._move(positionX, sign);

      handleGoTo();
    }
  }

  /**
   * Initialize slides.
   */
  private _initSlides(): Slide[] {
    const slides = this.settings.slides && this.settings.slides();

    return (slides || []).map(slide => new Slide(slide, this.frame, { virchual: this, eventBus: this._eventBus }));
  }

  /**
   * Hydrate existing slides from DOM.
   */
  private _hydrate(): Slide[] {
    return map(this.frame.children, element => new Slide(element, this.frame, { virchual: this, eventBus: this._eventBus })) as Slide[];
  }

  /**
   * Create clones of slides in case there are less slides than window size.
   */
  private _createClones(): Slide[] {
    const slidesLength = this.getSlidesLength();
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
  private _mountAndUnmountSlides({ control }: { control?: Direction } = {}) {
    const window = this.settings.window;
    const indicesWithoutClones = range(0, this.getSlidesLength() - 1);
    const indices = range(0, this.getSlidesLength(true) - 1);

    const virtualSlidesWindow = slidingWindow(indices, this.currentIndex, window);
    const virtualSlidesWindowWithoutClones = slidingWindow(indicesWithoutClones, this.currentIndex, window);

    const diffs = this._diff(virtualSlidesWindow, this._virtualSlidesWindow);

    diffs.forEach(diff => {
      const slideIndex = diff.slideIndex;
      const realSlideIndex = virtualSlidesWindowWithoutClones[diff.index];
      const isActive = slideIndex === this.currentIndex;
      let slide = getSlideByIndex(slideIndex, this._slides) || this._slides[slideIndex];

      // unmount
      if (diff.action.type === 'unmount') {
        slide.unmount();

        if (slide.isClone) {
          this._slides.splice(slideIndex, 1);
        }

        return;
      }

      // mount
      const prepend = control === PREV || diff.action.centerDistance < 0;

      // clone new slide
      if (slide == null) {
        slide = this._slides[realSlideIndex].clone();

        this._slides.splice(slideIndex, 0, slide);
      }

      slide.idx = slideIndex;
      slide.set('isActive', isActive).set('position', diff.action.centerDistance * 100);

      slide.mount(prepend);
    });

    this._virtualSlidesWindow = virtualSlidesWindow;
  }

  private _diff(current: number[], previous: number[]): Diff[] {
    previous = previous || [];

    const diffs: Diff[] = [
      // unmount
      ...this._calculateDiff(previous, current, (isFound, diff) => {
        if (!isFound) {
          diff.action.type = 'unmount';

          return diff;
        }
      }),

      // mount
      ...this._calculateDiff(current, []),
    ];

    return diffs;
  }

  private _calculateDiff(arrayA: number[], arrayB: number[], condition?: (isFound: boolean, diff: Diff) => Diff): Diff[] {
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
    this._isBusy && stop(event);
  };

  /**
   * Handle drag event.
   *
   * @param event
   */
  private _onDrag = (event: { offset: { x: number; y: number }; control: Direction }) => {
    if (!this._isEnabled) {
      return;
    }

    this._isBusy = true;

    const sign = event.control === PREV ? -1 : +1;
    const positionX = -1 * sign * Math.abs(event.offset.x);

    this._move(`${Math.round(positionX)}px`, sign, { easing: false });
  };

  /**
   * Handle dragged event.
   *
   * @param event
   */
  private _onDragEnd = (event: { control: Direction }) => {
    console.debug('[Drag] Drag end', event);

    this._goTo(event.control);
  };

  /**
   * Move slides to their new position.
   *
   * @param xPosition New slide position. Unit (px, %,..) has to be given.
   * @param sign Direction. Either -1 or +1.
   * @param callback Callback function which is called after moving has finished.
   */
  private _move(xPosition: string, sign: Sign, { easing, callback }: { easing?: boolean; callback?: identity } = {}) {
    let mountableSlideIndices = slidingWindow(range(0, this.getSlidesLength(true) - 1), this.currentIndex, this.settings.window);

    if (sign > 0) {
      mountableSlideIndices = mountableSlideIndices.slice(-1 * (this.settings.window + 1));
    } else {
      mountableSlideIndices = mountableSlideIndices.slice(0, this.settings.window + 1);
    }

    mountableSlideIndices.forEach(slideIndex => {
      const slide = this._slides[slideIndex];

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
}
