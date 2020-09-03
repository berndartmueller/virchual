import { identity } from './types';
import { addOrRemoveClass, append, prepend as prependFn, remove, createElement } from './utils/dom';
import { noop } from './utils/utils';
import { VirchualSettings } from './virchual';

/**
 * Virtual slide component.
 */
export class Slide {
  ref: HTMLElement;
  isMounted = false;
  isActive = false;
  position: number;

  private hasChanged = false;
  private html: string;
  private transitionEndCallback: identity;

  constructor(html: string | HTMLElement, private frame: HTMLElement, private settings: VirchualSettings) {
    if (typeof html === 'string') {
      this.html = html;

      return;
    }

    this.ref = html;
    this.html = this.ref.innerHTML;
    this.isMounted = true;
  }

  set<T extends Extract<keyof this, 'isActive' | 'position'>>(property: T, value: this[T]) {
    this[property] = value;

    this.hasChanged = true;
  }

  render(): HTMLElement {
    this.ref = createElement('div', { classNames: 'virchual__slide', html: this.html });

    this.setAttributes();

    return this.ref;
  }

  mount(prepend = false) {
    if (this.isMounted) {
      // slide has changed -> update in DOM
      if (this.hasChanged) {
        this.update();
      }

      return;
    }

    console.debug('[Mount] Slide', { ref: this.ref, prepend });

    this.render();

    this.isMounted = true;

    this.ref.addEventListener('transitionend', () => {
      this.ref.style.transition = '';

      this.transitionEndCallback();
    });

    const insert = prepend ? prependFn : append;

    insert(this.frame, this.ref);
  }

  unmount() {
    console.debug('[Unmount] Slide', { ref: this.ref });

    this.isMounted = false;

    remove(this.ref);
  }

  /**
   * Start transition.
   *
   * @param value Position to translate to.
   * @param easing Enable or disable transition easing.
   * @param done Callback function after transition has ended.
   */
  translate(value: number, { easing, done }: { easing?: boolean; done?: identity } = {}) {
    this.transitionEndCallback = done || noop;

    if (easing) {
      this.ref.style.transition = `transform ${this.settings['speed']}ms ${this.settings['easing']}`;
    } else {
      this.ref.style.transition = '';
    }

    this.ref.style.transform = `translate3d(calc(${this.position}% + ${Math.round(value)}px), 0, 0)`;
  }

  private update() {
    this.hasChanged = false;

    this.setAttributes();
  }

  private setAttributes() {
    addOrRemoveClass(this.ref, 'virchual__slide--active', !this.isActive);

    this.translate(0, { easing: true });
  }
}
