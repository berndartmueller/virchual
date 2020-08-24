import { identity } from './types';
import { VirchualOptions } from './virchual';
import { prepend as prependFn, domify, append, remove } from './utils/dom';

/**
 * Virtual slide component.
 */
export class Slide {
  isMounted = false;
  hasChanged = false;

  private content: string;
  private ref: HTMLElement;
  private transitionEndCallback: identity;
  private _isActive = false;
  private _position: number;

  constructor(content: string | HTMLElement, private frame: HTMLElement, private options: VirchualOptions) {
    if (typeof content === 'string') {
      this.content = content;
    } else {
      this.ref = content;
      this.content = this.ref.innerHTML;
      this.isMounted = true;
    }
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;

    this.hasChanged = true;
  }

  get position() {
    return this._position;
  }

  set position(value: number) {
    this._position = value;

    this.hasChanged = true;
  }

  render(): HTMLElement {
    const html = `<div class="virchual-slide ${this.isActive ? 'virchual-slide--active' : ''}" style="transform: translate3d(${
      this.position
    }%, 0, 0)">${this.content}</div>`;

    return domify(html) as HTMLElement;
  }

  update() {
    if (!this.ref) {
      return;
    }

    console.debug('[Update] Slide', { ref: this.ref });

    if (this.isActive) {
      this.ref.classList.add('virchual-slide--active');
    } else {
      this.ref.classList.remove('virchual-slide--active');
    }

    if (this.position != null) {
      this.ref.style.transform = `translate3d(${this.position}%, 0, 0)`;
    }
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

    this.isMounted = true;

    this.ref = this.render();

    this.ref.addEventListener('transitionend', e => {
      if (e.target === this.ref && this.transitionEndCallback) {
        this.transitionEndCallback();
      }
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
   * @param value
   * @param done
   */
  translate(value: number, done?: identity) {
    value = Math.round(value);

    this.transitionEndCallback = done;

    this.ref.style.transition = `transform ${this.options.speed}ms ${this.options.easing}`;
    this.ref.style.transform = `translate3d(calc(${this.position}% + ${value}px), 0, 0)`;
  }
}
