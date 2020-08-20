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
   * Go to next slide.
   *
   * @param silently - Go to the destination without event emission.
   */
  next(silently: boolean = false) {
    const nextIndex = this.instance.index + 1;

    this.track.go(nextIndex, this.rewind(nextIndex), silently);
  }

  /**
   * Go to previous slide.
   *
   * @param silently - Go to the destination without event emission.
   */
  previous(silently: boolean = false) {
    const nextIndex = this.instance.index - 1;

    this.track.go(nextIndex, this.rewind(nextIndex), silently);
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

    if (index > edge) {
      index = 0;
    } else if (index < 0) {
      index = edge;
    }

    return index;
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
