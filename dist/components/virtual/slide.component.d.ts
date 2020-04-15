import { BaseComponent } from './../base-component';
import VirtualSwiper, { VirtualSwiperOptions, VirtualSwiperComponents } from '../../virtual-swiper';
export declare class SlideComponent implements BaseComponent {
    private options;
    index: number;
    realIndex: number;
    slide: HTMLElement;
    /**
     * Container element if available.
     */
    container: Element;
    /**
     * Whether this is a cloned slide or not.
     */
    private isClone;
    /**
     * Hold the original styles.
     * @type {string}
     */
    private styles;
    private swiperInstance;
    private track;
    /**
     * Events when the slide status is updated.
     * Append a namespace to remove listeners later.
     */
    private statusUpdateEvents;
    constructor(options: VirtualSwiperOptions, index: number, realIndex: number, slide: HTMLElement);
    mount(instance: VirtualSwiper, components: VirtualSwiperComponents): void;
    /**
     * Destroy.
     */
    destroy(): void;
    /**
     * Update active and visible status.
     */
    update(): void;
    /**
     * Check whether this slide is active or not.
     *
     * @return {boolean} - True if the slide is active or false if not.
     */
    isActive(): boolean;
    /**
     * Check whether this slide is visible in the viewport or not.
     *
     * @return {boolean} - True if the slide is visible or false if not.
     */
    isVisible(): boolean;
    /**
     * Calculate how far this slide is from another slide and
     * return true if the distance is within the given number.
     *
     * @param {number} from   - Index of a target slide.
     * @param {number} within - True if the slide is within this number.
     *
     * @return {boolean} - True if the slide is within the number or false otherwise.
     */
    isWithin(from: number, within: number): boolean;
    /**
     * Update classes for activity or visibility.
     *
     * @param {boolean} active        - Is active/visible or not.
     * @param {boolean} forVisibility - Toggle classes for activity or visibility.
     */
    private updateClasses;
    /**
     * Restore the original styles.
     */
    private restoreStyles;
}
