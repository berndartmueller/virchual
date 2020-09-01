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

/**
 * Return true if bullet is edge bullet.
 *
 * @param index Index of bullet.
 * @param realIndex Real slide index which bullet represents.
 * @param bullets Amount of shown bullets.
 * @param total Total bullets. Same as amount of slides.
 */
export function isEdgeBullet(index: number, realIndex: number, bullets: number, total: number) {
  const isRightEdge = index === bullets - 1;

  // bullet is either left or right edge
  if (index === 0) {
    return index !== realIndex;
  }

  if (isRightEdge) {
    return realIndex + 1 < total;
  }

  return false;
}

/**
 * Get real index of bullet.
 *
 * @param index Index of bullet.
 * @param currentIndex Current active index.
 * @param activeBulletIndex Index of active bullet element.
 */
function getRealIndex(index: number, currentIndex: number, activeBulletIndex: number) {
  return currentIndex - activeBulletIndex + index;
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

    this.centerIndex = Math.floor(this.settings['bullets'] / 2);
  }

  render() {
    const bullets = this.settings['bullets'];
    const diameter = this.settings['diameter'];

    this.ref = createElement('div', { classNames: 'virchual__pagination' });

    this.ref.style.width = `${bullets * diameter}px`;
    this.ref.style.height = `${diameter}px`;

    range(0, Math.min(bullets, this.len) - 1).forEach(index => {
      const isEdge = isEdgeBullet(index, index, bullets, this.len);

      const bullet = this.renderBullet(index, { isEdge, isActive: index === this.currentIndex });

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
    const bulletsLength = this.settings['bullets'];

    this.currentIndex = rewind(this.currentIndex + sign, this.len - 1);

    const mappedActiveIndex = mapActiveIndex(this.currentIndex, this.centerIndex, this.len);
    const removeBullet = mappedActiveIndex === this.centerIndex && this.currentIndex > this.centerIndex;
    const removeBulletIndex = removeBullet ? (sign === 1 ? 0 : bulletsLength - 1) : -1;

    const bullets = [].slice.call(this.ref.querySelectorAll('span')) as HTMLElement[];

    bullets.forEach((bullet, index) => {
      this.handleBulletMovement({ bullet, index, sign, removeBullet, removeBulletIndex, activeIndex: mappedActiveIndex });
    });

    // append or prepend new bullet
    if (removeBullet) {
      const insertBulletIndex = -1 + bulletsLength - removeBulletIndex;
      const realIndex = getRealIndex(insertBulletIndex, this.currentIndex, mappedActiveIndex);
      const isEdge = isEdgeBullet(insertBulletIndex, realIndex, bulletsLength, this.len);

      const bullet = this.renderBullet(insertBulletIndex, { isEdge });

      this.insertBullet(sign, bullet);
    }
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

    const realIndex = getRealIndex(index, this.currentIndex, activeIndex);
    const isEdge = isEdgeBullet(index, realIndex, this.settings['bullets'], this.len);

    this.setAttributes(bullet, {
      isEdge,
      isActive: index === activeIndex,
      position: removeBullet ? index * this.settings['diameter'] : undefined,
    });
  }

  private renderBullet(index: number, { isActive, isEdge }: { isActive?: boolean; isEdge?: boolean } = {}) {
    const element = createElement('span', { classNames: 'virchual__pagination-bullet' });

    this.setAttributes(element, { isActive, isEdge, position: index * this.settings['diameter'] });

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
