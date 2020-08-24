import { Sign } from './types';
import { append, domify, prepend, remove } from './utils/dom';
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

  constructor(private container: HTMLElement, private count: number, private options: { size?: number; bullets?: number } = {}) {
    this.ref = container.querySelector('.virchual__pagination');

    this.options = {
      bullets: 5,
      size: 16,
      ...options,
    };

    this.centerIndex = Math.floor(this.options.bullets / 2);
  }

  render() {
    this.ref = domify(
      `<div class="virchual__pagination" style="width: ${this.options.bullets * this.options.size}px; height: ${
        this.options.size
      }px;"></div>`,
    );

    range(0, Math.min(this.options.bullets, this.count) - 1).forEach(index => {
      const bullet = this.renderBullet(index, { isActive: index === this.currentIndex });

      append(this.ref, bullet);
    });

    append(this.container, this.ref);
  }

  next() {
    this.go(+1);
  }

  prev() {
    this.go(-1);
  }

  private go(sign: Sign) {
    this.currentIndex = rewind(this.currentIndex + sign, this.count - 1);

    const mappedActiveIndex = mapActiveIndex(this.currentIndex, this.centerIndex, this.count);
    const removeBullet = mappedActiveIndex === this.centerIndex;
    const removeBulletIndex = removeBullet ? (sign === 1 ? 0 : this.options.bullets - 1) : -1;

    const bullets = [].slice.call(this.ref.querySelectorAll('span')) as HTMLElement[];

    bullets.forEach((bullet, index) =>
      this.handleBulletMovement({ bullet, index, sign, removeBullet, removeBulletIndex, activeIndex: mappedActiveIndex }),
    );

    const insertBulletIndex = -1 + this.options.bullets - removeBulletIndex;
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

    // shift index due to remove bulled
    index = index - (removeBullet ? sign : 0);

    bullet.classList.remove('virchual__pagination-bullet--active');
    bullet.classList.remove('virchual__pagination-bullet--edge');

    if (index === activeIndex) {
      bullet.classList.add('virchual__pagination-bullet--active');
    }

    if (index === removeBulletIndex) {
      bullet.classList.add('virchual__pagination-bullet--edge');
    }

    if (removeBullet) {
      bullet.style.transform = `translateX(${index * this.options.size}px)`;
    }
  }

  private renderBullet(index: number, { isActive, isEdge }: { isActive?: boolean; isEdge?: boolean } = {}) {
    const html = `<span class="virchual__pagination-bullet ${isActive ? 'virchual__pagination-bullet--active' : ''} ${
      isEdge ? 'virchual__pagination-bullet--edge' : ''
    }" style="transform: translateX(${this.options.size * index}px)"></span>`;

    const bullet = domify(html) as HTMLElement;

    return bullet;
  }

  private insertBullet(sign: Sign, bullet: HTMLElement) {
    const insert = sign === 1 ? append : prepend;

    insert(this.ref, bullet);
  }
}
