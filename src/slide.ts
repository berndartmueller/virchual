import { identity } from './types';
import { addOrRemoveClass, append, prepend as prependFn, remove } from './utils/dom';
import { noop } from './utils/utils';
import { VirchualOptions } from './virchual';

/**
 * Virtual slide component.
 */
export class Slide {
  isMounted = false;
  isActive = false;
  position: number;

  private hasChanged = false;
  private content: string;
  private ref: HTMLElement;
  private transitionEndCallback: identity;

  constructor(content: string | HTMLElement, private frame: HTMLElement, private options: VirchualOptions) {
    if (typeof content === 'string') {
      this.content = content;

      return;
    }

    this.ref = content;
    this.content = this.ref.innerHTML;
    this.isMounted = true;
  }

  set<T extends Extract<keyof this, 'isActive' | 'position'>>(property: T, value: this[T]) {
    this[property] = value;

    this.hasChanged = true;
  }

  render(): HTMLElement {
    const element = document.createElement('div');

    element.className = 'virchual-slide';
    element.innerHTML = this.content;

    this.setAttributes(element);

    return element;
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

    this.ref = this.render();

    this.isMounted = true;

    this.ref.addEventListener('transitionend', this.transitionEndCallback);

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
   * @param value
   * @param done
   */
  translate(value: number, done = noop) {
    this.transitionEndCallback = done;

    this.ref.style.transition = `transform ${this.options.speed}ms ${this.options.easing}`;
    this.ref.style.transform = `translate3d(calc(${this.position}% + ${Math.round(value)}px), 0, 0)`;
  }

  private update() {
    this.hasChanged = false;

    this.setAttributes(this.ref);
  }

  private setAttributes(element: HTMLElement) {
    addOrRemoveClass(element, 'virchual-slide--active', !this.isActive);

    element.style.transform = `translate3d(${this.position}%, 0, 0)`;
  }
}
