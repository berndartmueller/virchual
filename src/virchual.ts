import { BaseComponent } from './components/base-component';
import CloneComponent from './components/clone/clone.component';
import ControllerComponent from './components/controller/controller.component';
import DragComponent from './components/drag/drag.component';
import { HorizontalLayout } from './components/layout/directions/horizontal-layout';
import PaginationComponent from './components/pagination/pagination.component';
import TrackComponent from './components/track/track.component';
import VirtualComponent from './components/virtual/virtual.component';
import { ELEMENT_CLASSES as classes } from './constants/classes';
import { SliderType } from './constants/types';
import { Event } from './core/event';
import './css/styles.css';
import { SlideTransition } from './transitions/slide/index';
import { applyStyle, find } from './utils/dom';
import { error, exist } from './utils/error';
import { each } from './utils/object';

export type VirchualOptions = {
  type?: 'slide' | 'loop';
  slides?: VirchualSlides;
  rewindSpeed?: number;
  speed?: number;
  rewind?: boolean;
  focus?: boolean | string | number;
  perPage?: number;
  isNavigation?: boolean;
  drag?: boolean;
  easing?: string;
  gap?: number | string;
  padding?: { left: number | string; right: number | string };
  autoWidth?: boolean;
  width?: number | string;
  trimSpace?: boolean | string;
  direction?: string;
  fixedWidth?: number | string;
  height?: number;
  fixedHeight?: number | string;
  heightRatio?: number;
  updateOnMove?: boolean;
  swipeDistanceThreshold?: number;
  flickVelocityThreshold?: number;
  flickPower?: number;
  flickMaxPages?: number;
  classes?: any;
  cloneCount?: number;
  pagination?: boolean;
};

export type VirchualSlide = string | { key: string; html: string };
export type VirchualSlides = VirchualSlide[] | (() => VirchualSlide[]);

export type VirchualComponents = { [key: string]: BaseComponent };

export default class Virchual {
  root: HTMLElement;

  private _index: number;
  private event: Event;

  constructor(public selector: HTMLElement | string, public options: VirchualOptions = {}, private components: VirchualComponents = {}) {
    this.root = selector instanceof Element ? selector : find(document, selector);

    exist(this.root, 'Invalid element/selector');

    this._index = 0;
    this.options = {
      slides: [],
      type: 'loop',
      speed: 400,
      rewind: false,
      focus: false,
      perPage: 1,
      drag: true,
      isNavigation: false,
      trimSpace: false,
      autoWidth: false,
      padding: undefined,
      width: 0,
      gap: 0,
      direction: 'ltr',
      fixedWidth: 0,
      height: 0,
      fixedHeight: 0,
      heightRatio: 0,
      updateOnMove: false,
      swipeDistanceThreshold: 150,
      flickVelocityThreshold: 0.6,
      flickPower: 600,
      flickMaxPages: 1,
      easing: 'cubic-bezier(.42,.65,.27,.99)',
      cloneCount: 1,
      pagination: true,
      classes,
      ...options,
    };

    const defaultComponents: VirchualComponents = {
      Controller: new ControllerComponent(this.options),
      Track: new TrackComponent(this.options),
      Virtual: new VirtualComponent(this.options),
      Transition: new SlideTransition(this.options),
      Drag: new DragComponent(this.options),
      Layout: new HorizontalLayout(this.options),
      Clone: new CloneComponent(this.options),
      Pagination: new PaginationComponent(this.options),
    };

    this.components = {
      ...defaultComponents,
      ...this.components,
    };

    this.event = new Event();

    this.mount();
  }

  /**
   * Get current slide index.
   */
  get index() {
    return this._index;
  }

  set index(index: number) {
    this._index = parseInt(`${index}`, 10);
  }

  get length() {
    const virtual = this.components.Virtual as VirtualComponent;

    return virtual.length;
  }

  /**
   * Verify whether the slider type is the given one or not.
   *
   * @param type - A slider type.
   *
   * @return True if the slider type is the provided type or false if not.
   */
  is(type: SliderType): boolean {
    return type === this.options.type;
  }

  /**
   * Register callback fired on the given event(s).
   *
   * @param events  - An event name. Use space to separate multiple events.
   *                             Also, namespace is accepted by dot, such as 'resize.{namespace}'.
   * @param handler - A callback function.
   * @param elm     - Optional. Native event will be listened to when this arg is provided.
   * @param options - Optional. Options for addEventListener.
   *
   * @return  - This instance.
   */
  on(events: string, handler: any, elm: (Window & typeof globalThis) | Element = null, options: object = {}): Virchual {
    this.event.on(events, handler, elm, options);

    return this;
  }

  /**
   * Unsubscribe the given event.
   *
   * @param events - A event name.
   * @param elm    - Optional. removeEventListener() will be called when this arg is provided.
   *
   * @return This instance.
   */
  off(events: string, elm: (Window & typeof globalThis) | Element = null): Virchual {
    this.event.off(events, elm);

    return this;
  }

  /**
   * Emit an event.
   *
   * @param event - An event name.
   * @param args  - Any number of arguments passed to handlers.
   */
  emit(event: string, ...args: any) {
    this.event.emit(event, ...args);

    return this;
  }

  /**
   * Return the class list.
   *
   * @return An object containing all class list.
   */
  get classes() {
    return this.options.classes;
  }

  private mount() {
    try {
      each(this.components, (component: BaseComponent, key: string) => {
        component.mount(this, this.components);
      });
    } catch (e) {
      error(e.message);

      return;
    }

    each(this.components, component => {
      component.mounted && component.mounted();
    });

    this.emit('mounted');
    // this.State.set( STATES.IDLE ); todo
    this.emit('ready');

    applyStyle(this.root, { visibility: 'visible' });
  }
}

[].forEach.call(document.querySelectorAll('.image-swiper'), (slider: HTMLElement) => {
  new Virchual(slider, {
    slides: () => {
      const slides: { key: string; html: string }[] = [];

      for (let i = 0; i < 10; i++) {
        slides.push({
          key: i + '',
          html: `<span>Slide ${i + 1}</span>`,
        });
      }

      return slides;
    },
  });
});
