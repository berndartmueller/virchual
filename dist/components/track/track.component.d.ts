import VirtualSwiper, { VirtualSwiperComponents, VirtualSwiperOptions } from './../../virtual-swiper';
import { BaseComponent } from './../base-component';
import { HorizontalDirection } from './directions/horizontal';
export default class TrackComponent implements BaseComponent {
    private options;
    private currPosition;
    private isVertical;
    private isFade;
    private swiperInstance;
    private controller;
    private _direction;
    private transition;
    constructor(options: VirtualSwiperOptions);
    get direction(): HorizontalDirection;
    get list(): Element;
    mount(instance: VirtualSwiper, components: VirtualSwiperComponents): void;
    /**
     * Called after the component is mounted.
     * The resize event must be registered after the Layout's one is done.
     */
    mounted(): void;
    /**
     * Go to the given destination index.
     * After arriving there, the track is jump to the new index without animation, mainly for loop mode.
     *
     * @param {number}  destIndex - A destination index.
     *                              This can be negative or greater than slides length for reaching clones.
     * @param {number}  newIndex  - An actual new index. They are always same in Slide and Rewind mode.
     * @param {boolean} silently  - If true, suppress emitting events.
     */
    go(destIndex: any, newIndex: any, silently: any): void;
    /**
     * Called whenever slides arrive at a destination.
     *
     * @param {number}  destIndex - A destination index.
     * @param {number}  newIndex  - A new index.
     * @param {number}  prevIndex - A previous index.
     * @param {boolean} silently  - If true, suppress emitting events.
     */
    end(destIndex: number, newIndex: number, prevIndex: number, silently?: boolean): void;
    /**
     * Move the track to the specified index.
     *
     * @param {number} index - A destination index where the track jumps.
     */
    jump(index: any): void;
    /**
     * Set position.
     *
     * @param {number} position - A new position value.
     */
    translate(position: any): void;
    /**
     * Trim redundant spaces on the left or right edge if necessary.
     *
     * @param {number} position - Position value to be trimmed.
     *
     * @return {number} - Trimmed position.
     */
    trim(position: any): any;
    /**
     * Return coordinates object by the given position.
     *
     * @param position - A position value.
     *
     * @return - A coordinates object.
     */
    toCoord(position: any): {
        x: any;
        y: any;
    };
    /**
     * Return current position.
     *
     * @return Current position.
     */
    get position(): number;
    /**
     * Convert index to the trimmed position.
     *
     * @return {number} - Trimmed position.
     */
    getTrimmedPosition(index: any): any;
}
