import { BaseLayout } from './../index';
import { toPixel, unit } from '../../../utils/utils';
import { applyStyle } from '../../../utils/dom';

/**
 * Max width of a slide.
 */
const SLIDE_MAX_WIDTH = 5000;

export class HorizontalLayout extends BaseLayout {
  private padding: { left: number; right: number };
  private _gap: number;

  initLayout() {
    this._gap = toPixel(this.swiperInstance.root, this.options.gap);

    const padding = this.options.padding || { left: 0, right: 0 };
    const { left, right } = padding;

    this.padding = {
      left: toPixel(this.swiperInstance.root, left),
      right: toPixel(this.swiperInstance.root, right),
    };

    applyStyle(this.track.list, {
      paddingLeft: unit(left),
      paddingRight: unit(right),
    });
  }

  /**
   * Accumulate slide width including the gap to the designated index.
   *
   * @param index If undefined, width of all slides will be accumulated.
   *
   * @return Accumulated width.
   */
  totalWidth(index: number): number {
    return this.virtual
      .getSlides()
      .filter(slide => slide.index <= index)
      .reduce((accumulator, slide) => {
        return accumulator + this.slideWidth(slide.index) + this.gap;
      }, 0);
  }

  get width(): number {
    return this.track.track.clientWidth - this.padding.left - this.padding.right;
  }

  /**
   * Return list width.
   *
   * @return Current list width.
   */
  get listWidth() {
    const total = this.virtual.total;

    return this.options.autoWidth ? total * SLIDE_MAX_WIDTH : this.totalWidth(total);
  }

  get listHeight(): number {
    return 0;
  }

  /**
   * Return the slide height in px.
   *
   * @return The slide height.
   */
  get slideHeight() {
    const height = this.options.height || this.options.fixedHeight || this.width * this.options.heightRatio;

    return toPixel(this.swiperInstance.root, height);
  }

  /**
   * Return the slide width in px.
   *
   * @param {number} index - Slide index.
   *
   * @return {number} - The slide width.
   */
  slideWidth(index: number): number {
    if (this.options.autoWidth) {
      const slide = this.virtual.getSlide(index);

      return slide ? slide.slide.offsetWidth : 0;
    }

    const width: string | number = this.options.fixedWidth || (this.width + this.gap) / this.options.perPage - this.gap;

    return toPixel(this.swiperInstance.root, width);
  }

  get height(): number {
    return 0;
  }

  get margin(): string {
    return 'margin' + (this.options.direction === 'rtl' ? 'Left' : 'Right');
  }

  get gap(): number {
    return this._gap;
  }
}
