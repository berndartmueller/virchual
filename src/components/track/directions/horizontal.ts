import { between } from '../../../utils/utils';
import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from '../../../virtual-swiper';
import VirtualComponent from '../../virtual/virtual.component';
import { BaseLayout } from '../../layout/index';

export class HorizontalDirection {
  /**
   * Axis of translate.
   *
   * @type {string}
   */
  public axis: 'X' | 'Y' = 'X';

  /**
   * Sign for the direction.
   *
   * @type {number}
   */
  public sign: number = -1;

  private virtual: VirtualComponent;
  private layout: BaseLayout;

  constructor(private options: VirtualSwiperOptions, private instance: VirtualSwiper, private components: VirtualSwiperComponents) {
    this.virtual = components.Virtual as VirtualComponent;
    this.layout = components.Layout as BaseLayout;
  }

  /**
   * Calculate position by index.
   *
   * @param index - Slide index.
   *
   * @return Calculated position.
   */
  toPosition(index: number): number {
    return this.sign * (this.layout.totalWidth(index - 1) + this.offset(index));
  }

  /**
   * Calculate the closest slide index from the given position.
   *
   * @return The closest slide position.
   */
  toIndex(position: number): number {
    position *= this.sign;

    // if (this.instance.is(SLIDE)) {
    if (true) {
      position = between(position, this.layout.totalWidth(this.virtual.total), 0);
    }

    const slides = this.virtual.getSlides(true);

    for (const slide of slides) {
      const slideIndex = slide.index;
      const slidePosition = this.sign * this.toPosition(slideIndex);

      if (slidePosition < position && position <= slidePosition + this.layout.slideWidth(slideIndex) + this.layout.gap) {
        return slideIndex;
      }
    }

    return 0;
  }

  /**
   * Trim redundant spaces on the left or right edge if necessary.
   *
   * @param position - Position value to be trimmed.
   *
   * @return Trimmed position.
   */
  trim(position: number): number {
    const edge = this.sign * (this.layout.totalWidth(this.virtual.total) - (this.layout.width + this.layout.gap));

    return between(position, edge, 0);
  }

  /**
   * Return current offset value, considering direction.
   *
   * @return Offset amount.
   */
  offset(index: number): number {
    const { focus } = this.options;
    const slideWidth = this.layout.slideWidth(index);

    if (focus === 'center') {
      return -(this.layout.width - slideWidth) / 2;
    }

    return -(parseInt(`${focus}`) || 0) * (slideWidth + this.layout.gap);
  }
}
