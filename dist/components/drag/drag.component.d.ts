import VirtualSwiper, { VirtualSwiperOptions, VirtualSwiperComponents } from './../../virtual-swiper';
import { BaseComponent } from './../base-component';
export default class DragComponent implements BaseComponent {
    private options;
    private startCoord;
    private startInfo;
    private currentInfo;
    private isDragging;
    private isVertical;
    private axis;
    private isDisabled;
    private track;
    private layout;
    private controller;
    private swiperInstance;
    constructor(options: VirtualSwiperOptions);
    mount(instance: VirtualSwiper, components: VirtualSwiperComponents): void;
    private onStart;
    private onMove;
    /**
     * Determine whether to start moving the track or not by drag angle.
     *
     * @param {Object} info - An information object.
     *
     * @return {boolean} - True if the track should be moved or false if not.
     */
    private shouldMove;
    /**
     * Resist dragging the track on the first/last page because there is no more.
     *
     * @param {number} position - A position being applied to the track.
     *
     * @return {Object} - Adjusted position.
     */
    private resist;
    /**
     * Called when dragging ends.
     */
    private onEnd;
    /**
     * Go to the slide determined by the analyzed data.
     *
     * @param info - An info object.
     */
    private go;
    /**
     * Analyze the given event object and return important information for handling swipe behavior.
     *
     * @param event          - Touch or Mouse event object.
     * @param startInfo  - Information analyzed on start for calculating difference from the current one.
     *
     * @return - An object containing analyzed information, such as offset, velocity, etc.
     */
    private analyze;
}
