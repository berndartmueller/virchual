import { STATUS_CLASSES } from '../../constants/classes';
/**
 * The component for handling pagination
 */
import { addClass, append, applyStyle, create, remove, removeClass } from '../../utils/dom';
import { unit } from '../../utils/utils';
import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from '../../virtual-swiper';
import ControllerComponent from '../controller/controller.component';
import VirtualComponent from '../virtual/virtual.component';
import { BaseComponent } from './../base-component';

/**
 * The event name for updating some attributes of pagination nodes.
 */
const ATTRIBUTES_UPDATE_EVENT = 'move.page';

/**
 * The event name for recreating pagination.
 */
const UPDATE_EVENT = 'updated.page refresh.page';

/**
 * The component for handling pagination
 *
 * @param {Splide} Splide     - A Splide instance.
 * @param {Object} Components - An object containing components.
 * @param {string} name       - A component name as a lowercase string.
 *
 * @return {Object} - The component object.
 */
export default class TrackComponent implements BaseComponent {
  /**
   * Store all data for pagination.
   * - list: A list element.
   * - items: An array that contains objects(li, button, index, page).
   */
  private _data: any = {};

  private virtual: VirtualComponent;
  private controller: ControllerComponent;
  private swiperInstance: VirtualSwiper;
  private currentPosition: number;
  private previousFrom: number;
  private previousTo: number;
  private components: VirtualSwiperComponents;

  constructor(private options: VirtualSwiperOptions) {}

  mount(instance: VirtualSwiper, components: VirtualSwiperComponents) {
    this.swiperInstance = instance;
    this.components = components;
    this.virtual = components.Virtual as VirtualComponent;
    this.controller = components.Controller as ControllerComponent;
    this.currentPosition = 0;
    this.previousFrom = 0;
    this.previousTo = 0;

    this._data = this.createPagination();

    const parent = this.options.pagination ? this.swiperInstance.root : undefined;

    append(parent, this._data.list);

    this.bind();
  }

  /**
   * Called after all components are mounted.
   */
  mounted() {
    const index = this.swiperInstance.index;

    this.swiperInstance.emit(`${name}:mounted`, this._data, this.getItem(index));

    this.update(index, -1);
  }

  /**
   * Destroy the pagination.
   * Be aware that node.remove() is not supported by IE.
   */
  destroy() {
    remove(this._data.list);

    if (this._data.items) {
      this._data.items.forEach(item => {
        this.swiperInstance.off('click', item.button);
      });
    }

    this.swiperInstance.off(ATTRIBUTES_UPDATE_EVENT);
    this.swiperInstance.off(UPDATE_EVENT);

    this._data = {};
  }

  /**
   * Return an item by index.
   *
   * @param index - A slide index.
   *
   * @return An item object on success or undefined on failure.
   */
  getItem(index: number) {
    return this._data.items[this.controller.toPage(index)];
  }

  /**
   * Return object containing pagination data.
   *
   * @return {Object} - Pagination data including list and items.
   */
  get data(): any {
    return this._data;
  }

  /**
   * Listen some events.
   */
  private bind() {
    this.swiperInstance.on(ATTRIBUTES_UPDATE_EVENT, this.update.bind(this));
    this.swiperInstance.on(UPDATE_EVENT, () => {
      this.destroy();

      if (this.options.pagination) {
        this.mount(this.swiperInstance, this.components);
        this.mounted();
      }
    });
  }

  /**
   * Update attributes.
   *
   * @param index     - Active index.
   * @param prevIndex - Prev index.
   */
  private update(index: number, prevIndex: number) {
    const prev = this.getItem(prevIndex);
    const curr = this.getItem(index);
    const next = this.getItem(index + 1);
    const trackElement = this.data.track as HTMLElement;

    const active = STATUS_CLASSES.active;

    if (index > 4) {
      this.currentPosition = (index - 4) * 16 * -1;

      // insert bullet if there are more slides to come
      if (index < this.virtual.slides.length - 1) {
        const button = this.createBullet(index, 'active-next');

        append(trackElement, button);

        this._data.items.push({ button });

        // remove bullet from opposite end
        const firstButton = this.getItem(Math.abs(4 - index - 1));
        (firstButton.button as HTMLElement).parentNode.removeChild(firstButton.button);
        // this._data.items.shift();
      }
    }

    if (prev) {
      removeClass(prev.button, 'active-next');
      removeClass(prev.button, active);
      addClass(prev.button, 'active-prev');
    }

    if (curr) {
      removeClass(curr.button, 'active-prev');
      removeClass(curr.button, 'active-next');
      addClass(curr.button, active);
    }

    if (next) {
      removeClass(next.button, 'active-prev');
      removeClass(next.button, active);
      addClass(next.button, 'active-next');
    }

    if (index > 4) {
      applyStyle(trackElement, { transform: `translateX(${this.currentPosition}px)` });
      this.offsetPositionSlides();
    }

    this.swiperInstance.emit(`${name}:updated`, this.data, prev, curr);
  }

  /**
   * Create a wrapper and button elements.
   *
   * @return An object contains all data.
   */
  private createPagination() {
    const classes = this.options.classes;
    const wrapper = create('div', { class: classes.pagination });
    const track = create('div', { class: classes.paginationTrack });

    const count = Math.min(this.virtual.slides.length, 6);

    append(wrapper, track);

    const data = {
      track,
      list: wrapper,
      items: [],
    };

    for (let i = 0; i < count; i++) {
      const button = this.createBullet(i);

      append(track, button);

      data.items.push({ button });
    }

    return data;
  }

  private createBullet(index: number, cssClass: string = '') {
    const button = create('button', { class: `${this.options.classes.page} ${cssClass}`, type: 'button' });

    this.swiperInstance.on(
      'click',
      () => {
        this.controller.go(`>${index}`);
      },
      button,
    );

    return button;
  }

  /**
   * Position slides with offset to counteract removed slides
   */
  private offsetPositionSlides() {
    const offsetProp: string = 'left';
    const offset = 16 * Math.max(this.swiperInstance.index - 4, 0);

    const styles = {};
    styles[offsetProp] = unit(offset);

    this.data.items.forEach(bullet => {
      applyStyle(bullet.button, styles);
    });
  }
}
