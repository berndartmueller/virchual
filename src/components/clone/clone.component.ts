import { addClass, append, before, remove, removeAttribute, domify } from '../../utils/dom';
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

      this.swiperInstance.on('refresh', () => {
        this.destroy();
        this.generateClones();
      });

      this.swiperInstance.on('move', () => {
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
    const slides = this.virtual.getSlides();
    const firstSlide = slides[0];
    const lastSlide = slides.slice(-1)[0];

    const currentIndex = this.swiperInstance.index;
    const virtualSlidesLength = this.virtual.getSlides(false).length;

    if (currentIndex > 0 && currentIndex >= virtualSlidesLength - 1 && this.lengthAfter === 0) {
      this.virtual.slides.slice(0, count).forEach((slide, index) => {
        const node = domify(`<div class='vswiper-slide'>${slide.html}</div>`) as HTMLElement;
        const clone = this.cloneDeeply(node);

        append(this.track.list, clone);

        const slideClone = this.virtual.register(clone, index + length, index);

        this._clonesAfter.push(slideClone);

        this.swiperInstance.emit('cloned');
      });
    }

    if (this.lengthBefore === 0) {
      this.virtual.slides.slice(-count).forEach((slide, index) => {
        const node = domify(`<div class='vswiper-slide'>${slide.html}</div>`) as HTMLElement;
        const clone = this.cloneDeeply(node);

        before(clone, firstSlide.slide);

        const slideClone = this.virtual.register(clone, index - count, index);

        this._clonesBefore.push(slideClone);

        this.swiperInstance.emit('cloned');
      });
    }
  }

  private getCloneCount(): number {
    return this.options.cloneCount;
  }

  /**
   * Clone deeply the given element.
   *
   * @param slide - An element being duplicated.
   *
   * @return {Node} - A cloned node(element).
   */
  private cloneDeeply(element: HTMLElement): HTMLElement {
    const clone = element.cloneNode(true) as HTMLElement;

    addClass(clone, this.swiperInstance.classes.clone);

    // ID should not be duplicated.
    removeAttribute(clone, 'id');

    return clone as HTMLElement;
  }
}
