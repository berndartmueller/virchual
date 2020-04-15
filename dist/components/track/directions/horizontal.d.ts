import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from '../../../virtual-swiper';
export declare class HorizontalDirection {
    private options;
    private instance;
    private components;
    /**
     * Axis of translate.
     *
     * @type {string}
     */
    axis: 'X' | 'Y';
    /**
     * Sign for the direction.
     *
     * @type {number}
     */
    sign: number;
    private virtual;
    private layout;
    constructor(options: VirtualSwiperOptions, instance: VirtualSwiper, components: VirtualSwiperComponents);
    /**
     * Calculate position by index.
     *
     * @param {number} index - Slide index.
     *
     * @return {Object} - Calculated position.
     */
    toPosition(index: any): number;
    /**
     * Calculate the closest slide index from the given position.
     *
     * @return {number} - The closest slide position.
     */
    toIndex(position: any): number;
    /**
     * Trim redundant spaces on the left or right edge if necessary.
     *
     * @param {number} position - Position value to be trimmed.
     *
     * @return {number} - Trimmed position.
     */
    trim(position: any): number;
    /**
     * Return current offset value, considering direction.
     *
     * @return {number} - Offset amount.
     */
    offset(index: any): number;
}
