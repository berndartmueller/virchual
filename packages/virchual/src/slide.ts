import { ELEMENT_CLASSES } from './constants';
import { identity } from './types';
import { addOrRemoveClass, append, prepend as prependFn, remove, createElement } from './utils/dom';
import { noop } from './utils/utils';
import { ComponentDependencies } from './components/component';

/**
 * Virtual slide component.
 */
export class Slide {
  idx: number;
  ref: HTMLElement;
  isMounted = false;
  isActive = false;
  isClone = false;
  position: number;

  private _hasChanged = false;
  private _html: string | ((slideContainer: HTMLElement) => string | void);
  private _transitionEndCallback: identity = noop;

  constructor(
    html: string | HTMLElement | ((slideContainer: HTMLElement) => string | void),
    private _frame: HTMLElement,
    private _imports: ComponentDependencies,
  ) {
    if (typeof html === 'string' || typeof html === 'function') {
      this._html = html;

      return;
    }

    this.ref = html;
    this._html = this.ref.innerHTML;
    this.isMounted = true;

    this._bindEvents();
  }

  set<T extends Extract<keyof this, 'isActive' | 'position'>>(property: T, value: this[T]): Slide {
    this[property] = value;

    this._hasChanged = true;

    return this;
  }

  /**
   * Render and mount slide into DOM.
   *
   * @param prepend Either prepend slide to frame DOM element or append.
   */
  mount(prepend = false) {
    if (this.isMounted) {
      // slide has changed -> update in DOM
      if (this._hasChanged) {
        this._update();
      }

      return;
    }

    this._render();

    this.isMounted = true;

    console.debug('[Mount] Slide', this);

    this._bindEvents();

    const insert = prepend ? prependFn : append;

    insert(this._frame, this.ref);
  }

  /**
   * Unmount and remove slide from DOM.
   */
  unmount() {
    console.debug('[Unmount] Slide', this);

    this.isMounted = false;

    this._unbindEvents();

    remove(this.ref);
  }

  /**
   * Clone slide and return clone.
   *
   * @returns Cloned slide instance.
   */
  clone(): Slide {
    const slide = new Slide(this._html, this._frame, this._imports);

    slide.isClone = true;

    return slide;
  }

  /**
   * Start transition.
   *
   * @param value Position to translate to. Unit (px, %,..) has to be given.
   * @param easing Enable or disable transition easing.
   * @param done Callback function after transition has ended.
   */
  translate(xPosition: string, { ease, done }: { ease?: boolean; done?: identity } = {}) {
    this._transitionEndCallback = done || noop;

    let value = '';

    if (ease) {
      value = `transform ${this._imports.virchual.settings.speed}ms ${this._imports.virchual.settings.easing}`;
    }

    this.ref.style.transition = value;
    this.ref.style.transform = `translate3d(calc(${this.position}% + ${xPosition}), 0, 0)`;
  }

  private _render(): HTMLElement {
    this.ref = createElement('div', {
      classNames: ELEMENT_CLASSES._slide,
    });

    if (typeof this._html === 'function') {
      const rendered = this._html(this.ref);

      if (typeof rendered === 'string') {
        this.ref.innerHTML = rendered;
      }
    } else {
      this.ref.innerHTML = this._html;
    }

    this._setAttributes();

    return this.ref;
  }

  private _bindEvents() {
    this._imports.eventBus.on('transitionend', this._onTransitionEnd, this.ref);
  }

  private _unbindEvents() {
    this._imports.eventBus.off('transitionend', this._onTransitionEnd, this.ref);
  }

  private _update() {
    console.debug('[Update] Slide', this);

    this._hasChanged = false;

    this._setAttributes();
  }

  private _setAttributes() {
    addOrRemoveClass(this.ref, ELEMENT_CLASSES._slideActive, !this.isActive);

    this.translate('0%');
  }

  private _onTransitionEnd = () => {
    this.ref.style.transition = '';

    this._transitionEndCallback();
  };
}
