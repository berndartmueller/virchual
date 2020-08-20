import { prepend as prependFn, domify, append, remove } from '../utils/dom';

/**
 * Virtual slide component.
 */
export class Slide {
  isMounted: boolean = false;
  hasChanged: boolean = false;

  private html: string;
  private ref: HTMLElement;
  private _isActive: boolean = false;
  private _position: number;

  constructor(public content: string, private frame: HTMLElement) {}

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

  render() {
    return `<div class="virchual-slide ${this.isActive ? 'virchual-slide--active' : ''}" style="transform: translate3d(${
      this.position
    }%, 0, 0)">${this.content}</div>`;
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

  mount(prepend: boolean = false) {
    if (this.isMounted) {
      // slide has changed -> update in DOM
      if (this.hasChanged) {
        this.update();
      }

      return;
    }

    console.debug('[Mount] Slide', { ref: this.ref, prepend });

    this.isMounted = true;

    this.html = this.render();

    this.ref = domify(this.html) as HTMLElement;

    if (prepend) {
      prependFn(this.frame, this.ref);

      return;
    }

    append(this.frame, this.ref);
  }

  unmount() {
    if (!this.isMounted) return;

    console.debug('[Unmount] Slide', { ref: this.ref });

    this.isMounted = false;

    remove(this.ref);
  }

  translate(value: number) {
    value = Math.round(value);

    this.ref.style.transitionDuration = 'unset';
    this.ref.style.transform = `translate3d(calc(${this.position}% + ${value}px), 0, 0)`;
  }
}
