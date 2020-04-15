import { BaseComponent } from './../../components/base-component';
import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from '../../virtual-swiper';
export declare class SlideTransition implements BaseComponent {
    private options;
    /**
     * Hold the list element.
     *
     * @type {Element}
     */
    private list;
    /**
     * Hold the onEnd callback function.
     *
     * @type {function}
     */
    private endCallback;
    private track;
    private controller;
    constructor(options: VirtualSwiperOptions);
    mount(instance: VirtualSwiper, components: VirtualSwiperComponents): void;
    /**
     * Start transition.
     *
     * @param {number}   destIndex - Destination slide index that might be clone's.
     * @param {number}   newIndex  - New index.
     * @param {number}   prevIndex - Previous index.
     * @param {Object}   coord     - Destination coordinates.
     * @param {function} done      - Callback function must be invoked when transition is completed.
     */
    start(destIndex: any, newIndex: any, prevIndex: any, coord: any, done: any): void;
}
