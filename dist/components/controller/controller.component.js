import { between } from '../../utils/utils';
import { Event } from './../../core/event';
export default class ControllerComponent {
    constructor(options) {
        this.options = options;
        /**
         * True if the slide is LOOP mode.
         *
         * @type {boolean}
         */
        this.isLoop = true;
    }
    mount(instance, components) {
        this.swiperInstance = instance;
        this.track = components.Track;
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
     * @param {string|number} control  - A control pattern.
     * @param {boolean}       silently - Go to the destination without event emission.
     */
    go(control, silently) {
        const destIndex = this.trim(this.parse(control));
        this.track.go(destIndex, this.rewind(destIndex), silently);
    }
    /**
     * Parse the given control and return the destination index for the track.
     *
     * @param {string} control - A control target pattern.
     *
     * @return {string|number} - A parsed target.
     */
    parse(control) {
        let index = this.swiperInstance.index;
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
                index = parseInt(control);
        }
        return index;
    }
    /**
     * Compute index from the given page number.
     *
     * @param {number} page - Page number.
     *
     * @return {number} - A computed page number.
     */
    toIndex(page) {
        if (this.hasFocus()) {
            return page;
        }
        const length = this.swiperInstance.length;
        const perPage = this.options.perPage;
        let index = page * perPage;
        index = index - (this.pageLength * perPage - length) * Math.floor(index / length);
        // Adjustment for the last page.
        if (length - perPage <= index && index < length) {
            index = length - perPage;
        }
        return index;
    }
    /**
     * Compute page number from the given slide index.
     *
     * @param index - Slide index.
     *
     * @return {number} - A computed page number.
     */
    toPage(index) {
        if (this.hasFocus()) {
            return index;
        }
        const length = this.swiperInstance.length;
        const perPage = this.options.perPage;
        // Make the last "perPage" number of slides belong to the last page.
        if (length - perPage <= index && index < length) {
            return Math.floor((length - 1) / perPage);
        }
        return Math.floor(index / perPage);
    }
    /**
     * Trim the given index according to the current mode.
     * Index being returned could be less than 0 or greater than the length in Loop mode.
     *
     * @param {number} index - An index being trimmed.
     *
     * @return {number} - A trimmed index.
     */
    trim(index) {
        if (!this.isLoop) {
            index = this.options.rewind ? this.rewind(index) : between(index, 0, this.edgeIndex);
        }
        return index;
    }
    /**
     * Rewind the given index if it's out of range.
     *
     * @param {number} index - An index.
     *
     * @return {number} - A rewound index.
     */
    rewind(index) {
        const edge = this.edgeIndex;
        if (this.isLoop) {
            while (index > edge) {
                index -= edge + 1;
            }
            while (index < 0) {
                index += edge + 1;
            }
        }
        else {
            if (index > edge) {
                index = 0;
            }
            else if (index < 0) {
                index = edge;
            }
        }
        return index;
    }
    /**
     * Check if the direction is "rtl" or not.
     *
     * @return {boolean} - True if "rtl" or false if not.
     */
    isRtl() {
        return this.options.direction === 'rtl';
    }
    /**
     * Return the page length.
     *
     * @return {number} - Max page number.
     */
    get pageLength() {
        const length = this.swiperInstance.length;
        return this.hasFocus() ? length : Math.ceil(length / this.options.perPage);
    }
    /**
     * Return the edge index.
     *
     * @return {number} - Edge index.
     */
    get edgeIndex() {
        const length = this.swiperInstance.length;
        if (!length) {
            return 0;
        }
        if (this.hasFocus() || this.options.isNavigation || this.isLoop) {
            return length - 1;
        }
        return length - this.options.perPage;
    }
    /**
     * Return the index of the previous slide.
     *
     * @return {number} - The index of the previous slide if available. -1 otherwise.
     */
    get prevIndex() {
        let prev = this.swiperInstance.index - 1;
        if (this.isLoop || this.options.rewind) {
            prev = this.rewind(prev);
        }
        return prev > -1 ? prev : -1;
    }
    /**
     * Return the index of the next slide.
     *
     * @return {number} - The index of the next slide if available. -1 otherwise.
     */
    get nextIndex() {
        let next = this.swiperInstance.index + 1;
        if (this.isLoop || this.options.rewind) {
            next = this.rewind(next);
        }
        return (this.swiperInstance.index < next && next <= this.edgeIndex) || next === 0 ? next : -1;
    }
    /**
     * Listen some events.
     */
    bind() {
        Event.on('move', newIndex => {
            this.swiperInstance.index = newIndex;
        });
        Event.on('updated refresh', newOptions => {
            this.options = newOptions || this.options;
            this.swiperInstance.index = between(this.swiperInstance.index, 0, this.edgeIndex);
        });
    }
    /**
     * Verify if the focus option is available or not.
     *
     * @return {boolean} - True if a slider has the focus option.
     */
    hasFocus() {
        return this.options.focus !== false;
    }
}
