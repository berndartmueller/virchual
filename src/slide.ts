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

  private hasChanged = false;
  private html: string;
  private isBusyTranslating: boolean;
  private transitionEndCallback: identity = noop;
  private asyncAction: identity = noop;

  constructor(html: string | HTMLElement, private frame: HTMLElement, private imports: ComponentDependencies) {
    if (typeof html === 'string') {
      this.html = html;

      return;
    }

    this.ref = html;
    this.html = this.ref.innerHTML;
    this.isMounted = true;

    this.bindEvents();
  }

  set<T extends Extract<keyof this, 'isActive' | 'position'>>(property: T, value: this[T]) {
    this[property] = value;

    this.hasChanged = true;
  }

  mount(prepend = false) {
    this.doAfterTranslating(() => {
      if (this.isMounted) {
        // slide has changed -> update in DOM
        if (this.hasChanged) {
          this.update();
        }

        return;
      }

      this.render();

      console.debug('[Mount] Slide', this);

      this.isMounted = true;

      this.bindEvents();

      const insert = prepend ? prependFn : append;

      insert(this.frame, this.ref);
    });
  }

  unmount() {
    console.debug('[Unmount] Slide - Start', this);

    this.isMounted = false;

    this.doAfterTranslating(() => {
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
    const slide = new Slide(this.html, this.frame, this.imports);

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
    this.transitionEndCallback = done || noop;

    if (easing) {
      console.log('Translate WITH easing', this, xPosition);

      this.isBusyTranslating = true;

      this.ref.style.transition = `transform ${this.imports.virchual.settings['speed']}ms ${this.imports.virchual.settings['easing']}`;
    } else {
      console.log('Translate without easing', this, xPosition);
      this.ref.style.transition = '';
    }

    this.ref.style.transform = `translate3d(calc(${this.position}% + ${xPosition}), 0, 0)`;
  }

  private render(): HTMLElement {
    this.ref = createElement('div', { classNames: 'virchual__slide', html: this.html });

    this.setAttributes();

    return this.ref;
  }

  private bindEvents() {
    this.ref.addEventListener('transitionend', () => {
      console.log('END', this);
      this.isBusyTranslating = false;

      this.ref.style.transition = '';

      this.asyncAction();
      this.transitionEndCallback();
    });

    this.imports.eventBus.on('move', () => {
      this.isBusyTranslating = false;
    });
  }

  private update() {
    console.debug('[Update] Slide', this);

    this.hasChanged = false;

    this.setAttributes();
  }

  private setAttributes() {
    addOrRemoveClass(this.ref, 'virchual__slide--active', !this.isActive);

    this.ref.setAttribute('data-idx', this.idx + '');

    this.translate('0%');
  }

  private doAfterTranslating(callback: identity) {
    // call callback immediately
    if (!this.isBusyTranslating) {
      callback();

      return;
    }

    console.log('NEEDS ASYNC', this);
    this.asyncAction = () => {
      console.log('ASYNC ACTION', this);
      callback();

      this.asyncAction = noop;
    };
  }
}
