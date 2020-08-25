import { Sign } from './types';
import { addOrRemoveClass, append, prepend, remove, createElement } from './utils/dom';
import { range, rewind } from './utils/utils';

/**
 * Map current index to bullet elements index.
 *
 * @param index Current index.
 * @param center Center index of bullets (5 bullets -> center: 2).
 * @param total Total bullets. Same as amount of slides.
 */
export function mapActiveIndex(index: number, center: number, total: number) {
  return index - Math.max(index - center, 0) + Math.max(index - (-1 + total - center), 0);
}

export class Pagination {
  private ref: HTMLElement;
  private currentIndex = 0;
  private centerIndex: number;

  constructor(private container: HTMLElement, private len: number, private settings: { diameter?: number; bullets?: number } = {}) {
    this.ref = container.querySelector('.virchual__pagination');

    this.settings = {
      bullets: 5,
      diameter: 16,
      ...settings,
    };

    this.centerIndex = Math.floor(this.settings.bullets / 2);
  }

  render() {
    this.ref = createElement('div', { classNames: 'virchual__pagination' });

    this.ref.style.width = `${this.settings.bullets * this.settings.diameter}px`;
    this.ref.style.height = `${this.settings.diameter}px`;

    range(0, Math.min(this.settings.bullets, this.len) - 1).forEach(index => {
      const bullet = this.renderBullet(index, { isActive: index === this.currentIndex, isEdge: false });

      append(this.ref, bullet);
    });

    append(this.container, this.ref);
  }

  next() {
    this.goTo(+1);
  }

  prev() {
    this.goTo(-1);
  }

  private goTo(sign: Sign) {
    this.currentIndex = rewind(this.currentIndex + sign, this.len - 1);

    const mappedActiveIndex = mapActiveIndex(this.currentIndex, this.centerIndex, this.len);
    const removeBullet = mappedActiveIndex === this.centerIndex;
    const removeBulletIndex = removeBullet ? (sign === 1 ? 0 : this.settings.bullets - 1) : -1;

    const bullets = [].slice.call(this.ref.querySelectorAll('span')) as HTMLElement[];

    bullets.forEach((bullet, index) =>
      this.handleBulletMovement({ bullet, index, sign, removeBullet, removeBulletIndex, activeIndex: mappedActiveIndex }),
    );

    const insertBulletIndex = -1 + this.settings.bullets - removeBulletIndex;
    const bullet = this.renderBullet(insertBulletIndex, { isEdge: true });

    // append or prepend new bullet
    removeBullet && this.insertBullet(sign, bullet);
  }

  private handleBulletMovement({
    bullet,
    index,
    activeIndex,
    sign,
    removeBullet,
    removeBulletIndex,
  }: {
    bullet: HTMLElement;
    index: number;
    activeIndex: number;
    sign: Sign;
    removeBullet: boolean;
    removeBulletIndex: number;
  }) {
    if (removeBulletIndex === index) {
      return remove(bullet);
    }

    // shift index due to remove bullet
    index = index - (removeBullet ? sign : 0);

    this.setAttributes(bullet, {
      isActive: index === activeIndex,
      isEdge: index === removeBulletIndex,
      position: removeBullet ? index * this.settings.diameter : undefined,
    });
  }

  private renderBullet(index: number, { isActive, isEdge }: { isActive?: boolean; isEdge?: boolean } = {}) {
    const element = createElement('span', { classNames: 'virchual__pagination-bullet' });

    this.setAttributes(element, { isActive, isEdge, position: index * this.settings.diameter });

    return element;
  }

  private setAttributes(bullet: HTMLElement, { isActive, isEdge, position }: { isActive: boolean; isEdge: boolean; position?: number }) {
    addOrRemoveClass(bullet, 'virchual__pagination-bullet--active', !isActive);
    addOrRemoveClass(bullet, 'virchual__pagination-bullet--edge', !isEdge);

    if (position != null) {
      bullet.style.transform = `translateX(${position}px)`;
    }
  }

  private insertBullet(sign: Sign, bullet: HTMLElement) {
    const insert = sign === 1 ? append : prepend;

    insert(this.ref, bullet);
  }
}
