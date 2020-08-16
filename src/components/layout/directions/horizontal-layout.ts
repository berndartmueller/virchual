import { BaseLayout } from './../index';
import { toPixel, unit } from '../../../utils/utils';
import { applyStyle } from '../../../utils/dom';

export class HorizontalLayout extends BaseLayout {
  private padding: { left: number; right: number };
  private _gap: number;

  initLayout() {
    this._gap = toPixel(this.instance.root, this.options.gap);

    const padding = this.options.padding || { left: 0, right: 0 };
    const { left, right } = padding;

    this.padding = {
      left: toPixel(this.instance.root, left),
      right: toPixel(this.instance.root, right),
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
      .getSlides(true)
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

    return this.totalWidth(total);
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

    return toPixel(this.instance.root, height);
  }

  /**
   * Return the slide width in px.
   *
   * @param index - Slide index.
   *
   * @return The slide width.
   */
  slideWidth(index?: number): number {
    const width: string | number = this.width + this.gap - this.gap;

    return toPixel(this.instance.root, width);
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
