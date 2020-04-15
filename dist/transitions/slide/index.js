import { Event } from './../../core/event';
import { applyStyle } from '../../utils/dom';
export class SlideTransition {
    constructor(options) {
        this.options = options;
    }
    mount(instance, components) {
        this.controller = components.Controller;
        this.track = components.Track;
        this.list = this.track.list;
        Event.on('transitionend', e => {
            if (e.target === this.list && this.endCallback) {
                this.endCallback();
            }
        }, this.list);
    }
    /**
     * Start transition.
     *
     * @param {number}   destIndex - Destination slide index that might be clone's.
     * @param {number}   newIndex  - New index.
     * @param {number}   prevIndex - Previous index.
     * @param {Object}   coord     - Destination coordinates.
     * @param {function} done      - Callback function must be invoked when transition is completed.
     */
    start(destIndex, newIndex, prevIndex, coord, done) {
        const options = this.options;
        const edgeIndex = this.controller.edgeIndex;
        let speed = options.speed;
        this.endCallback = done;
        if ((prevIndex === 0 && newIndex >= edgeIndex) || (prevIndex >= edgeIndex && newIndex === 0)) {
            speed = options.rewindSpeed || speed;
        }
        applyStyle(this.list, {
            transition: `transform ${speed}ms ${options.easing}`,
            transform: `translate(${coord.x}px,${coord.y}px)`,
        });
    }
}
