import { addClass, append, before, remove, removeAttribute } from '../../utils/dom';
import TrackComponent from '../track/track.component';
import VirtualComponent from '../virtual/virtual.component';
import { LOOP } from './../../constants/types';
import { Event } from './../../core/event';
import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from './../../virtual-swiper';
import { BaseComponent } from './../base-component';
import { SlideComponent } from './../virtual/slide.component';

export default class CloneComponent implements BaseComponent {
  /**
   * Store information of clones.
   */
  private _clonesBefore: SlideComponent[] = [];
  private _clonesAfter: SlideComponent[] = [];

  private swiperInstance: VirtualSwiper;
  private virtual: VirtualComponent;
  private track: TrackComponent;

  constructor(private options: VirtualSwiperOptions) {}

  mount(instance: VirtualSwiper, components: VirtualSwiperComponents) {
    this.swiperInstance = instance;
    this.virtual = components.Virtual as VirtualComponent;
    this.track = components.Track as TrackComponent;

    if (this.swiperInstance.is(LOOP)) {
      this.generateClones();

      Event.on('refresh', () => {
        this.destroy();
        this.generateClones();
      });

      Event.on('move', () => {
        this.generateClones();
      });
    }
  }

  /**
   * Destroy.
   */
  destroy() {
    remove(this.clones.map(clone => clone.slide));

    this._clonesBefore = [];
    this._clonesAfter = [];
  }

  /**
   * Return all clones.
   *
   * @return {Element[]} - Cloned elements.
   */
  get clones() {
    return [...this._clonesBefore, ...this._clonesAfter];
  }

  /**
   * Return clone length.
   *
   * @return {number} - A length of clones.
   */
  get length() {
    return this.clones.length;
  }

  /**
   * Return before clone length.
   *
   * @return {number} - A length of before clones.
   */
  get lengthBefore() {
    return this._clonesBefore.length;
  }

  /**
   * Return after clone length.
   *
   * @return {number} - A length of after clones.
   */
  get lengthAfter() {
    return this._clonesAfter.length;
  }

  private generateClones() {
    const length = this.virtual.length;

    if (!length) {
      return;
    }

    const count = this.getCloneCount();
    let slides = this.virtual.getSlides();

    while (slides.length < count) {
      slides = slides.concat(slides);
    }

    const currentIndex = this.swiperInstance.index;

    if (currentIndex > 0 && this.lengthAfter === 0) {
      slides.slice(0, count).forEach((slide, index) => {
        const clone = this.cloneDeeply(slide);

        append(this.track.list, clone);

        const slideClone = this.virtual.register(clone, index + length, index);

        this._clonesAfter.push(slideClone);
      });
    }

    if (this.lengthBefore === 0) {
      slides.slice(-count).forEach((elm, index) => {
        const clone = this.cloneDeeply(elm);

        before(clone, slides[0].slide);

        const slideClone = this.virtual.register(clone, index - count, index);

        this._clonesBefore.push(slideClone);
      });
    }
  }

  /**
   * Return half count of clones to be generated.
   * Clone count is determined by:
   * - Max pages a flick action can move.
   * - Whether the slide length is enough for perPage.
   *
   * @return {number} - Count for clones.
   */
  private getCloneCount() {
    const options = this.options;

    if (options.autoWidth) {
      return this.virtual.length;
    }

    return options.perPage * (options.drag ? options.flickMaxPages : 1);
  }

  /**
   * Clone deeply the given element.
   *
   * @param slide - An element being duplicated.
   *
   * @return {Node} - A cloned node(element).
   */
  private cloneDeeply(slide: SlideComponent): HTMLElement {
    const clone = slide.slide.cloneNode(true) as HTMLElement;

    addClass(clone, this.swiperInstance.classes.clone);

    // ID should not be duplicated.
    removeAttribute(clone, 'id');

    return clone as HTMLElement;
  }
}
