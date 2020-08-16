import { SlideComponent } from './slide.component';
import Virchual, { VirchualOptions, VirchualComponents, VirchualSlide } from './../../virchual';
import { BaseComponent } from './../base-component';
import { domify, append, applyStyle } from '../../utils/dom';
import TrackComponent from '../track/track.component';
import { pad, unit } from '../../utils/utils';
import { Event } from './../../core/event';
import { exist } from '../../utils/error';
import { values } from '../../utils/object';
import { BaseLayout } from '../layout/index';

type VirtualSlide = {
  index: number;
  key?: string;
  html: string;
};

/**
 * The property name for UID stored in a window object.
 */
const UID_NAME: string = 'uid';

export default class VirtualComponent implements BaseComponent {
  private hydratedSlides: HTMLElement[];
  private _slides: VirtualSlide[];
  private virtualSlides: SlideComponent[];
  private track: TrackComponent;
  private layout: BaseLayout;
  private instance: Virchual;
  private previousFrom: number;
  private previousTo: number;

  constructor(private options: VirchualOptions) {
    this.previousFrom = 0;
    this.previousTo = 0;
  }

  mount(instance: Virchual, components: VirchualComponents) {
    this.instance = instance;
    this.track = components.Track as TrackComponent;
    this.layout = components.Layout as BaseLayout;

    /*
     * Assign unique ID to the root element if it doesn't have the one.
     * Note that IE doesn't support padStart() to fill the uid by 0.
     */
    if (!this.instance.root.id) {
      window['virchual'] = window['virchual'] || {};

      const uid = window['virchual'][UID_NAME] || 0;

      window['virchual'][UID_NAME] = uid + 1;

      this.instance.root.id = `virchual-${pad(uid)}`;
    }

    this.collect();
    this.init();
    this.bind();
  }

  get total() {
    return this.virtualSlides.length;
  }

  /**
   * Return slides length without clones.
   *
   * @return Slide length.
   */
  get length() {
    return this.getSlides().length;
  }

  get slides() {
    return this._slides || [];
  }

  getSlide(index: number, includeClones: boolean = true) {
    return this.virtualSlides
      .filter(slide => slide.index === index)
      .filter(slide => includeClones === true || (includeClones === false && !slide.isClone))[0];
  }

  /**
   * Return all Slide objects.
   *
   * @param includeClones - Whether to include cloned slides or not.
   * @return Slide objects.
   */
  getSlides(includeClones: boolean = false): SlideComponent[] {
    return includeClones ? this.virtualSlides : this.virtualSlides.filter(slide => !slide.isClone);
  }

  each(callback: (slide: SlideComponent) => void) {
    this.virtualSlides.forEach(callback);
  }

  /**
   * Register a slide to create a Slide object and handle its behavior.
   *
   * @param slide     - A slide element.
   * @param index     - A unique index. This can be negative.
   * @param realIndex - A real index for clones. Set -1 for real slides.
   */
  register(slide: HTMLElement, index: number, realIndex: number, key?: string) {
    const slideInstance = new SlideComponent(this.options, index, realIndex, slide, key);

    slideInstance.mount(this.instance, { Track: this.track });

    this.virtualSlides.push(slideInstance);

    return slideInstance;
  }

  private init() {
    let slides: VirchualSlide[] = [];
    this.virtualSlides = [];

    if (typeof this.options.slides === 'function') {
      slides = this.options.slides();
    } else {
      slides = this.options.slides;
    }

    slides = slides || [];

    this._slides = slides.map((slide, index) => {
      if (typeof slide === 'string') {
        return {
          index,
          html: slide,
        };
      }

      return {
        index,
        key: slide.key,
        html: slide.html,
      };
    });

    this._slides.slice(0, 2).forEach((slide, index) => {
      const hydratedSlide = this.hydratedSlides.find(hydratedSlide => hydratedSlide.dataset.key === slide.key);
      let element: HTMLElement;

      // use already existig and hydrated DOM node
      if (hydratedSlide) {
        element = hydratedSlide;

        // create new DOM node
      } else {
        element = domify(`<div class='virchual-slide'>${slide.html}</div>`);

        append(this.track.list, element);
      }

      this.register(element, index, -1, slide.key);
    });
  }

  /**
   * Collect elements.
   */
  private collect() {
    exist(this.track.track && this.track.list, 'Track or list was not found.');

    this.hydratedSlides = values(this.track.list.children);
  }

  private bind() {
    this.instance.on('move', (newIndex, prevIndex) => {
      const slide = this._slides[1 + newIndex];

      if (slide == null) {
        return;
      }

      const virtualSlide = this.getSlide(slide.index);

      // slide already injected in DOM
      if (virtualSlide) {
        return;
      }

      const node = domify(`<div class='virchual-slide'>${slide.html}</div>`);

      append(this.track.list, node);

      this.register(node, 1 + newIndex, -1, slide.key);

      this.instance.emit('add', 1 + newIndex);
    });

    this.instance.on('moved', () => {
      const slidesBefore = 2;
      const slidesAfter = 2;

      const from = Math.max((this.instance.index || 0) - slidesBefore, 0);
      const to = Math.min((this.instance.index || 0) + slidesAfter, this.length - 1);

      for (let i = this.previousFrom; i <= this.previousTo; i += 1) {
        if (i < from || i > to) {
          const slide = this.getSlide(i, false);

          slide.slide.parentNode.removeChild(slide.slide);
        }
      }

      this.previousFrom = from;
      this.previousTo = to;

      this.offsetPositionSlides();
    });
  }

  /**
   * Position slides with offset to counteract removed slides
   */
  private offsetPositionSlides() {
    const offsetProp: string = 'left';
    const offset = this.layout.slideWidth() * this.previousFrom;

    const styles = {};
    styles[offsetProp] = this.options.autoWidth ? null : unit(offset);

    this.each(slide => {
      applyStyle(slide.slide, styles);
    });
  }
}
