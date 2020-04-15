import VirtualComponent from '../virtual/virtual.component';
import TrackComponent from '../track/track.component';
import VirtualSwiper, { VirtualSwiperOptions, VirtualSwiperComponents } from '../../virtual-swiper';
import { BaseComponent } from '../base-component';
export declare abstract class BaseLayout implements BaseComponent {
    protected options: VirtualSwiperOptions;
    protected swiperInstance: VirtualSwiper;
    protected track: TrackComponent;
    protected virtual: VirtualComponent;
    constructor(options: VirtualSwiperOptions);
    abstract initLayout(): any;
    abstract get listWidth(): number;
    abstract get listHeight(): number;
    abstract get slideHeight(): number;
    abstract slideWidth(index: number): number;
    abstract get height(): number;
    abstract get margin(): string;
    abstract get gap(): number;
    abstract totalWidth(index: number): number;
    abstract get width(): number;
    mount(instance: VirtualSwiper, components: VirtualSwiperComponents): void;
    private init;
    /**
     * Listen the resize native event with throttle.
     * Initialize when the component is mounted or options are updated.
     */
    private bind;
    /**
     * Resize the list and slides including clones.
     */
    private onResize;
}
