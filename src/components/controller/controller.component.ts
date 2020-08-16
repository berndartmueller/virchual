import { between } from '../../utils/utils';
import TrackComponent from '../track/track.component';
import Virchual, { VirchualComponents, VirchualOptions } from './../../virchual';
import { BaseComponent } from './../base-component';

export default class ControllerComponent implements BaseComponent {
  /**
   * True if the slide is LOOP mode.
   */
  private isLoop: boolean = true;

  private instance: Virchual;
  private track: TrackComponent;

  constructor(private options: VirchualOptions) {}

  mount(instance: Virchual, components: VirchualComponents) {
    this.instance = instance;
    this.track = components.Track as TrackComponent;

    this.bind();
  }

  /**
   * Make track run by the given control.
   * - "+{i}" : Increment the slide index by i.
   * - "-{i}" : Decrement the slide index by i.
   * - "{i}"  : Go to the slide whose index is i.
   * - ">"    : Go to next page.
   * - "<"    : Go to prev page.
   * - ">{i}" : Go to page i.
   *
   * @param control  - A control pattern.
   * @param silently - Go to the destination without event emission.
   */
  go(control: string | number, silently: boolean = false) {
    const destIndex = this.trim(this.parse(control));

    this.track.go(destIndex, this.rewind(destIndex), silently);
  }

  /**
   * Parse the given control and return the destination index for the track.
   *
   * @param control - A control target pattern.
   *
   * @return A parsed target.
   */
  parse(control: string | number): number {
    let index = this.instance.index;

    const matches = String(control).match(/([+\-<>])(\d+)?/);
    const indicator = matches ? matches[1] : '';
    const number = matches ? parseInt(matches[2]) : 0;

    switch (indicator) {
      case '+':
        index += number || 1;
        break;

      case '-':
        index -= number || 1;
        break;

      case '>':
        index = this.toIndex(number > -1 ? number : this.toPage(index) + 1);
        break;

      case '<':
        index = this.toIndex(number > -1 ? number : this.toPage(index) - 1);
        break;

      default:
        index = parseInt(`${control}`);
    }

    return index;
  }

  /**
   * Compute index from the given page number.
   *
   * @param page - Page number.
   *
   * @return A computed page number.
   */
  toIndex(page: number): number {
    if (this.hasFocus()) {
      return page;
    }

    const length = this.instance.length;

    let index = page;
    index = index - (this.pageLength - length) * Math.floor(index / length);

    // Adjustment for the last page.
    if (length - 1 <= index && index < length) {
      index = length - 1;
    }

    return index;
  }

  /**
   * Compute page number from the given slide index.
   *
   * @param index - Slide index.
   *
   * @return A computed page number.
   */
  toPage(index: number): number {
    if (this.hasFocus()) {
      return index;
    }

    const length = this.instance.length;

    if (length - 1 <= index && index < length) {
      return length - 1;
    }

    return index;
  }

  /**
   * Trim the given index according to the current mode.
   * Index being returned could be less than 0 or greater than the length in Loop mode.
   *
   * @param index - An index being trimmed.
   *
   * @return A trimmed index.
   */
  trim(index: number): number {
    if (!this.isLoop) {
      index = this.options.rewind ? this.rewind(index) : between(index, 0, this.edgeIndex);
    }

    return index;
  }

  /**
   * Rewind the given index if it's out of range.
   *
   * @param index - An index.
   *
   * @return A rewound index.
   */
  rewind(index: number): number {
    const edge = this.edgeIndex;

    if (this.isLoop) {
      while (index > edge) {
        index -= edge + 1;
      }

      while (index < 0) {
        index += edge + 1;
      }
    } else {
      if (index > edge) {
        index = 0;
      } else if (index < 0) {
        index = edge;
      }
    }

    return index;
  }

  /**
   * Check if the direction is "rtl" or not.
   *
   * @return True if "rtl" or false if not.
   */
  isRtl(): boolean {
    return this.options.direction === 'rtl';
  }

  /**
   * Return the page length.
   *
   * @return Max page number.
   */
  get pageLength(): number {
    const length = this.instance.length;
    return this.hasFocus() ? length : Math.ceil(length);
  }

  /**
   * Return the edge index.
   *
   * @return Edge index.
   */
  get edgeIndex(): number {
    const length = this.instance.length;

    if (!length) {
      return 0;
    }

    if (this.hasFocus() || this.options.isNavigation || this.isLoop) {
      return length - 1;
    }

    return length - 1;
  }

  /**
   * Return the index of the previous slide.
   *
   * @return The index of the previous slide if available. -1 otherwise.
   */
  get prevIndex(): number {
    let prev = this.instance.index - 1;

    if (this.isLoop || this.options.rewind) {
      prev = this.rewind(prev);
    }

    return prev > -1 ? prev : -1;
  }

  /**
   * Return the index of the next slide.
   *
   * @return The index of the next slide if available. -1 otherwise.
   */
  get nextIndex(): number {
    let next = this.instance.index + 1;

    if (this.isLoop || this.options.rewind) {
      next = this.rewind(next);
    }

    return (this.instance.index < next && next <= this.edgeIndex) || next === 0 ? next : -1;
  }

  /**
   * Listen some events.
   */
  private bind() {
    this.instance.on('move', newIndex => {
      this.instance.index = newIndex;
    });

    this.instance.on('updated refresh', newOptions => {
      this.options = newOptions || this.options;

      this.instance.index = between(this.instance.index, 0, this.edgeIndex);
    });
  }

  /**
   * Verify if the focus option is available or not.
   *
   * @return True if a slider has the focus option.
   */
  private hasFocus(): boolean {
    return this.options.focus !== false;
  }
}
