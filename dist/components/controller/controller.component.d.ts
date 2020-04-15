import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from './../../virtual-swiper';
import { BaseComponent } from './../base-component';
export default class ControllerComponent implements BaseComponent {
    private options;
    /**
     * True if the slide is LOOP mode.
     *
     * @type {boolean}
     */
    private isLoop;
    private swiperInstance;
    private track;
    constructor(options: VirtualSwiperOptions);
    mount(instance: VirtualSwiper, components: VirtualSwiperComponents): void;
    /**
     * Make track run by the given control.
     * - "+{i}" : Increment the slide index by i.
     * - "-{i}" : Decrement the slide index by i.
     * - "{i}"  : Go to the slide whose index is i.
     * - ">"    : Go to next page.
     * - "<"    : Go to prev page.
     * - ">{i}" : Go to page i.
     *
     * @param {string|number} control  - A control pattern.
     * @param {boolean}       silently - Go to the destination without event emission.
     */
    go(control: any, silently: any): void;
    /**
     * Parse the given control and return the destination index for the track.
     *
     * @param {string} control - A control target pattern.
     *
     * @return {string|number} - A parsed target.
     */
    parse(control: any): number;
    /**
     * Compute index from the given page number.
     *
     * @param {number} page - Page number.
     *
     * @return {number} - A computed page number.
     */
    toIndex(page: any): any;
    /**
     * Compute page number from the given slide index.
     *
     * @param index - Slide index.
     *
     * @return {number} - A computed page number.
     */
    toPage(index: any): any;
    /**
     * Trim the given index according to the current mode.
     * Index being returned could be less than 0 or greater than the length in Loop mode.
     *
     * @param {number} index - An index being trimmed.
     *
     * @return {number} - A trimmed index.
     */
    trim(index: any): any;
    /**
     * Rewind the given index if it's out of range.
     *
     * @param {number} index - An index.
     *
     * @return {number} - A rewound index.
     */
    rewind(index: any): any;
    /**
     * Check if the direction is "rtl" or not.
     *
     * @return {boolean} - True if "rtl" or false if not.
     */
    isRtl(): boolean;
    /**
     * Return the page length.
     *
     * @return {number} - Max page number.
     */
    get pageLength(): number;
    /**
     * Return the edge index.
     *
     * @return {number} - Edge index.
     */
    get edgeIndex(): number;
    /**
     * Return the index of the previous slide.
     *
     * @return {number} - The index of the previous slide if available. -1 otherwise.
     */
    get prevIndex(): number;
    /**
     * Return the index of the next slide.
     *
     * @return {number} - The index of the next slide if available. -1 otherwise.
     */
    get nextIndex(): number;
    /**
     * Listen some events.
     */
    private bind;
    /**
     * Verify if the focus option is available or not.
     *
     * @return {boolean} - True if a slider has the focus option.
     */
    private hasFocus;
}
