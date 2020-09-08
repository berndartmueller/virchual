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
  private _isBusyTranslating: boolean;
  private _transitionEndCallback: identity = noop;
  private _asyncAction: identity = noop;

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

  set<T extends Extract<keyof this, 'isActive' | 'position'>>(property: T, value: this[T]) {
    this[property] = value;

    this._hasChanged = true;
  }

  mount(prepend = false) {
    this._doAfterTranslating(() => {
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

  unmount() {
    console.debug('[Unmount] Slide - Start', this);

    this.isMounted = false;

    this._doAfterTranslating(() => {
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

    if (easing) {
      console.log('Translate WITH easing', this, xPosition);

      this._isBusyTranslating = true;

      this.ref.style.transition = `transform ${this._imports.virchual.settings['speed']}ms ${this._imports.virchual.settings['easing']}`;
    } else {
      console.log('Translate without easing', this, xPosition);
      this.ref.style.transition = '';
    }

    this.ref.style.transform = `translate3d(calc(${this.position}% + ${xPosition}), 0, 0)`;
  }

  private _render(): HTMLElement {
    this.ref = createElement('div', { classNames: ELEMENT_CLASSES.slide, html: this._html });

    this._setAttributes();

    return this.ref;
  }

  private _bindEvents() {
    this.ref.addEventListener('transitionend', () => {
      console.log('END', this);
      this._isBusyTranslating = false;

      this.ref.style.transition = '';

      this._asyncAction();
      this._transitionEndCallback();
    });

    this._imports.eventBus.on('move', () => {
      this._isBusyTranslating = false;
    });
  }

  private _update() {
    console.debug('[Update] Slide', this);

    this._hasChanged = false;

    this._setAttributes();
  }

  private _setAttributes() {
    addOrRemoveClass(this.ref, ELEMENT_CLASSES.slideActive, !this.isActive);

    this.ref.setAttribute('data-idx', this.idx + '');

    this.translate('0%');
  }

  private _doAfterTranslating(callback: identity) {
    // call callback immediately
    if (!this._isBusyTranslating) {
      callback();

      return;
    }

    console.log('NEEDS ASYNC', this);
    this._asyncAction = () => {
      console.log('ASYNC ACTION', this);
      callback();

      this._asyncAction = noop;
    };
  }
}
