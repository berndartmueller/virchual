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
  private _html: string;
  private _isIdle = true;
  private _transitionEndCallback: identity = noop;
  private _idleCallback: identity = noop;

  constructor(html: string | HTMLElement, private _frame: HTMLElement, private _imports: ComponentDependencies) {
    if (typeof html === 'string') {
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
    this._onIdle(() => {
      if (this.isMounted) {
        // slide has changed -> update in DOM
        if (this._hasChanged) {
          this._update();
        }

        return;
      }

      this._render();

      console.debug('[Mount] Slide', this);

      this.isMounted = true;

      this._bindEvents();

      const insert = prepend ? prependFn : append;

      insert(this._frame, this.ref);
    });
  }

  /**
   * Unmount and remove slide from DOM.
   */
  unmount() {
    console.debug('[Unmount] Slide - Start', this);

    this.isMounted = false;

    this._onIdle(() => {
      this._unbindEvents();

      remove(this.ref);

      console.debug('[Unmount] Slide - End', this);
    });
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
  translate(xPosition: string, { easing, done }: { easing?: boolean; done?: identity } = {}) {
    this._transitionEndCallback = done || noop;

    this._isIdle = easing !== true;

    let value = '';

    if (easing) {
      value = `transform ${this._imports.virchual.settings.speed}ms ${this._imports.virchual.settings.easing}`;
    }

    this.ref.style.transition = value;
    this.ref.style.transform = `translate3d(calc(${this.position}% + ${xPosition}), 0, 0)`;
  }

  private _render(): HTMLElement {
    this.ref = createElement('div', { classNames: ELEMENT_CLASSES._slide, html: this._html });

    this._setAttributes();

    return this.ref;
  }

  private _bindEvents() {
    this._imports.eventBus.on('transitionend', this._onTransitionEnd, this.ref);
    this._imports.eventBus.on('move', this._onMove);
  }

  private _unbindEvents() {
    this._imports.eventBus.off('transitionend', this._onTransitionEnd, this.ref);
    this._imports.eventBus.off('move', this._onMove);
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

  /**
   * Execute callback as soon as slide is idle and all transitions finished.
   *
   * @param callback Callback function.
   */
  private _onIdle(callback: identity) {
    // call callback immediately
    if (this._isIdle) {
      callback();

      return;
    }

    this._idleCallback = () => {
      callback();

      this._resetIdleCallback();
    };
  }

  private _resetIdleCallback() {
    this._idleCallback = noop;
    this._isIdle = true;
  }

  private _onTransitionEnd = () => {
    this.ref.style.transition = '';

    this._idleCallback();
    this._transitionEndCallback();

    this._resetIdleCallback();
  };

  private _onMove = () => {
    this._resetIdleCallback();
  };
}
