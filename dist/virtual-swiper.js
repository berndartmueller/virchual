import ControllerComponent from './components/controller/controller.component';
import DragComponent from './components/drag/drag.component';
import { HorizontalLayout } from './components/layout/directions/horizontal-layout';
import TrackComponent from './components/track/track.component';
import VirtualComponent from './components/virtual/virtual.component';
import { SlideTransition } from './transitions/slide/index';
import { find } from './utils/dom';
import { error, exist } from './utils/error';
import { each } from './utils/object';
export default class VirtualSwiper {
    constructor(selector, options = {}, components = {}) {
        this.selector = selector;
        this.options = options;
        this.components = components;
        this.root = selector instanceof Element ? selector : find(document, selector);
        exist(this.root, 'An invalid element/selector was given.');
        this._index = 0;
        this.options = Object.assign({ slides: [], speed: 400, rewind: false, focus: false, perPage: 1, isNavigation: true, trimSpace: false, autoWidth: false, padding: undefined, width: 0, gap: 0, direction: 'ltr', fixedWidth: 0, height: 0, fixedHeight: 0, heightRatio: 0, updateOnMove: false, swipeDistanceThreshold: 150, flickVelocityThreshold: 0.6, flickPower: 600, flickMaxPages: 1, easing: 'cubic-bezier(.42,.65,.27,.99)' }, options);
        const defaultComponents = {
            Controller: new ControllerComponent(this.options),
            Transition: new SlideTransition(this.options),
            Track: new TrackComponent(this.options),
            Virtual: new VirtualComponent(this.options),
            Drag: new DragComponent(this.options),
            Layout: new HorizontalLayout(this.options),
        };
        this.components = Object.assign(Object.assign({}, defaultComponents), this.components);
        this.mount();
    }
    get index() {
        return this._index;
    }
    set index(index) {
        this._index = parseInt(`${index}`, 10);
    }
    get length() {
        return 0;
    }
    mount() {
        try {
            each(this.components, (component, key) => {
                component.mount(this, this.components);
            });
        }
        catch (e) {
            error(e.message);
            return null;
        }
    }
}
const instance = new VirtualSwiper(window.document.body, {
    slides: () => {
        const slides = [];
        for (let i = 0; i < 5; i++) {
            slides.push(`<span>Slide ${i + 1}</span>`);
        }
        return slides;
    },
});
