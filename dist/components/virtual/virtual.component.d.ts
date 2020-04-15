import { SlideComponent } from './slide.component';
import VirtualSwiper, { VirtualSwiperOptions, VirtualSwiperComponents } from './../../virtual-swiper';
import { BaseComponent } from './../base-component';
export default class VirtualComponent implements BaseComponent {
    private options;
    private slides;
    private virtualSlides;
    private track;
    private swiperInstance;
    constructor(options: VirtualSwiperOptions);
    mount(instance: VirtualSwiper, components: VirtualSwiperComponents): void;
    get total(): number;
    /**
     * Return slides length without clones.
     *
     * @return Slide length.
     */
    get length(): number;
    getSlide(index: number): SlideComponent;
    getSlides(): SlideComponent[];
    each(callback: (slide: SlideComponent) => void): void;
    private init;
    /**
     * Register a slide to create a Slide object and handle its behavior.
     *
     * @param slide     - A slide element.
     * @param index     - A unique index. This can be negative.
     * @param realIndex - A real index for clones. Set -1 for real slides.
     */
    private register;
}
