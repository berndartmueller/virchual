import { Event } from './../../core/event';
import { applyStyle } from '../../utils/dom';
import { unit } from '../../utils/utils';
import { throttle } from '../../utils/time';
/**
 * Interval time for throttle.
 *
 * @type {number}
 */
const THROTTLE = 100;
export class BaseLayout {
    constructor(options) {
        this.options = options;
    }
    mount(instance, components) {
        this.swiperInstance = instance;
        this.virtual = components.Virtual;
        this.track = components.Track;
        this.bind();
        this.init();
    }
    init() {
        this.initLayout();
        applyStyle(this.swiperInstance.root, { maxWidth: unit(this.options.width) });
        this.virtual.each(slide => {
            slide.slide.style[this.margin] = unit(this.gap);
        });
        this.onResize();
    }
    /**
     * Listen the resize native event with throttle.
     * Initialize when the component is mounted or options are updated.
     */
    bind() {
        Event.on('resize load', throttle(() => {
            Event.emit('resize');
        }, THROTTLE), window);
        Event.on('resize', this.onResize.bind(this));
        Event.on('updated refresh', this.init.bind(this));
    }
    /**
     * Resize the list and slides including clones.
     */
    onResize() {
        applyStyle(this.track.list, { width: unit(this.listWidth), height: unit(this.listHeight) });
        // applyStyle(this.track.list, { height: unit(this.height) });
        const slideHeight = unit(this.slideHeight);
        this.virtual.each(slide => {
            applyStyle(slide.container, { height: slideHeight });
            applyStyle(slide.slide, {
                width: this.options.autoWidth ? null : unit(this.slideWidth(slide.index)),
                height: slide.container ? null : slideHeight,
            });
        });
    }
}
