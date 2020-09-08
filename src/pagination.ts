import { Sign } from './types';
import { addOrRemoveClass, append, createElement, prepend, remove } from './utils/dom';
import { range, rewind } from './utils/utils';
import { ELEMENT_CLASSES } from './constants';

/**
 * Map current index to bullet elements index.
 *
 * @param index Current index.
 * @param center Center index of bullets (5 bullets -> center: 2).
 * @param bullets Amount of bullets.
 * @param total Total bullets. Same as amount of slides.
 */
export function mapActiveIndex(index: number, center: number, bullets: number, total: number) {
  if (bullets >= total) {
    return index;
  }

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
  private _ref: HTMLElement;
  private _currentIndex = 0;
  private _centerIndex: number;
  private _bulletsLength: number;
  private _diameter: number;
  private _isActive = true;

  constructor(
    private _container: HTMLElement,
    private _totalSlides: number,
    { diameter, bullets, isActive }: { diameter?: number; bullets?: number; isActive?: boolean } = {},
  ) {
    this._ref = _container.querySelector(`.${ELEMENT_CLASSES.pagination}`);

    this._bulletsLength = Math.min(_totalSlides, bullets ?? 5);
    this._diameter = diameter ?? 16;
    this._isActive = isActive ?? true;

    this._centerIndex = Math.floor(this._bulletsLength / 2);
  }

  render() {
    // quit early, no pagination bullets for less than 2 slides
    if (!this._isActive || this._totalSlides < 2) {
      this._isActive = false;

      return;
    }

    this._ref = createElement('div', { classNames: ELEMENT_CLASSES.pagination });

    this._ref.style.width = `${this._bulletsLength * this._diameter}px`;
    this._ref.style.height = `${this._diameter}px`;

    range(0, Math.min(this._bulletsLength, this._totalSlides) - 1).forEach(index => {
      const isEdge = isEdgeBullet(index, index, this._bulletsLength, this._totalSlides);

      const bullet = this._renderBullet(index, { isEdge, isActive: index === this._currentIndex });

      append(this._ref, bullet);
    });

    append(this._container, this._ref);
  }

  next() {
    this._goTo(+1);
  }

  prev() {
    this._goTo(-1);
  }

  private _goTo(sign: Sign) {
    if (!this._isActive) {
      return;
    }

    this._currentIndex = rewind(this._currentIndex + sign, this._totalSlides - 1);

    const mappedActiveIndex = mapActiveIndex(this._currentIndex, this._centerIndex, this._bulletsLength, this._totalSlides);
    const overflowRight = this._currentIndex + this._centerIndex + (sign > 0 ? 0 : 1) < this._totalSlides;
    const overflowLeft = this._currentIndex - this._centerIndex > 0;
    const removeBullet = mappedActiveIndex === this._centerIndex && (sign > 0 ? overflowLeft : overflowRight);

    let removeBulletIndex = -1;

    if (removeBullet) {
      removeBulletIndex = sign === 1 ? 0 : this._bulletsLength - 1;
    }

    const bullets = [].slice.call(this._ref.querySelectorAll('span')) as HTMLElement[];

    bullets.forEach((bullet, index) => {
      this._handleBulletMovement({ bullet, index, sign, removeBullet, removeBulletIndex, activeIndex: mappedActiveIndex });
    });

    // append or prepend new bullet
    if (removeBullet) {
      const insertBulletIndex = -1 + this._bulletsLength - removeBulletIndex;
      const realIndex = getRealIndex(insertBulletIndex, this._currentIndex, mappedActiveIndex);
      const isEdge = isEdgeBullet(insertBulletIndex, realIndex, this._bulletsLength, this._totalSlides);

      const bullet = this._renderBullet(insertBulletIndex, { isEdge });

      this._insertBullet(sign, bullet);
    }
  }

  private _handleBulletMovement({
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
      remove(bullet);

      return;
    }

    // shift index due to remove bullet
    index = index - (removeBullet ? sign : 0);

    const realIndex = getRealIndex(index, this._currentIndex, activeIndex);
    const isEdge = isEdgeBullet(index, realIndex, this._bulletsLength, this._totalSlides);

    this._setAttributes(bullet, {
      isEdge,
      isActive: index === activeIndex,
      position: removeBullet ? index * this._diameter : undefined,
    });
  }

  private _renderBullet(index: number, { isActive, isEdge }: { isActive?: boolean; isEdge?: boolean } = {}) {
    const element = createElement('span', { classNames: ELEMENT_CLASSES.paginationBullet });

    this._setAttributes(element, { isActive, isEdge, position: index * this._diameter });

    return element;
  }

  private _setAttributes(bullet: HTMLElement, { isActive, isEdge, position }: { isActive: boolean; isEdge: boolean; position?: number }) {
    addOrRemoveClass(bullet, ELEMENT_CLASSES.paginationBulletActive, !isActive);
    addOrRemoveClass(bullet, ELEMENT_CLASSES.paginationBulletEdge, !isEdge);

    if (position != null) {
      bullet.style.transform = `translateX(${position}px)`;
    }
  }

  private _insertBullet(sign: Sign, bullet: HTMLElement) {
    const insert = sign === 1 ? append : prepend;

    insert(this._ref, bullet);
  }
}
