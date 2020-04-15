import { Event } from './../../core/event';
/**
 * Adjust how much the track can be pulled on the first or last page.
 * The larger number this is, the farther the track moves.
 * This should be around 5 - 9.
 */
const FRICTION_REDUCER = 7;
export default class DragComponent {
    constructor(options) {
        this.options = options;
        // Whether the slider direction is vertical or not.
        this.isVertical = false;
        // Axis for the direction.
        this.axis = this.isVertical ? 'y' : 'x';
        this.isDisabled = false;
    }
    mount(instance, components) {
        this.swiperInstance = instance;
        this.track = components.Track;
        this.layout = components.Layout;
        this.controller = components.Controller;
        Event.on('touchstart mousedown', this.onStart.bind(this), this.track.list);
        Event.on('touchmove mousemove', this.onMove.bind(this), this.track.list, { passive: false });
        Event.on('touchend touchcancel mouseleave mouseup dragend', this.onEnd.bind(this), this.track.list);
    }
    onStart(event) {
        if (!this.isDisabled && !this.isDragging) {
            this.startCoord = this.track.toCoord(this.track.position);
            this.startCoord = { x: 0, y: 0 };
            this.startInfo = this.analyze(event, {});
            this.currentInfo = this.startInfo;
        }
    }
    onMove(event) {
        if (this.startInfo) {
            this.currentInfo = this.analyze(event, this.startInfo);
            if (this.isDragging) {
                if (event.cancelable) {
                    event.preventDefault();
                }
                const position = this.startCoord[this.axis] + this.currentInfo.offset[this.axis];
                this.track.translate(this.resist(position));
            }
            else {
                if (this.shouldMove(this.currentInfo)) {
                    Event.emit('drag', this.startInfo);
                    this.isDragging = true;
                }
            }
        }
    }
    /**
     * Determine whether to start moving the track or not by drag angle.
     *
     * @param {Object} info - An information object.
     *
     * @return {boolean} - True if the track should be moved or false if not.
     */
    shouldMove({ offset }) {
        // if (Splide.State.is(IDLE)) {
        if (true) {
            let angle = (Math.atan(Math.abs(offset.y) / Math.abs(offset.x)) * 180) / Math.PI;
            if (this.isVertical) {
                angle = 90 - angle;
            }
            const dragAngleThreshold = 45;
            return angle < dragAngleThreshold;
        }
        return false;
    }
    /**
     * Resist dragging the track on the first/last page because there is no more.
     *
     * @param {number} position - A position being applied to the track.
     *
     * @return {Object} - Adjusted position.
     */
    resist(position) {
        // if (!Splide.is(LOOP)) {
        //   const sign = Track.sign;
        //   const start = sign * Track.trim(Track.toPosition(0));
        //   const end = sign * Track.trim(Track.toPosition(Controller.edgeIndex));
        //   position *= sign;
        //   if (position < start) {
        //     position = start - FRICTION_REDUCER * Math.log(start - position);
        //   } else if (position > end) {
        //     position = end + FRICTION_REDUCER * Math.log(position - end);
        //   }
        //   position *= sign;
        // }
        return position;
    }
    /**
     * Called when dragging ends.
     */
    onEnd() {
        this.startInfo = null;
        if (this.isDragging) {
            Event.emit('dragged', this.currentInfo);
            this.go(this.currentInfo);
            this.isDragging = false;
        }
    }
    /**
     * Go to the slide determined by the analyzed data.
     *
     * @param info - An info object.
     */
    go(info) {
        const velocity = info.velocity[this.axis];
        const absV = Math.abs(velocity);
        if (absV > 0) {
            const options = this.options;
            const sign = velocity < 0 ? -1 : 1;
            let destination = this.track.position;
            if (absV > options.flickVelocityThreshold && Math.abs(info.offset[this.axis]) < options.swipeDistanceThreshold) {
                destination += sign * Math.min(absV * options.flickPower, this.layout.width * (options.flickMaxPages || 1));
            }
            let index = this.track.direction.toIndex(destination);
            // Do not allow the track to go to a previous position.
            if (index === this.swiperInstance.index) {
                index += sign * this.track.direction.sign;
            }
            // if ( ! Splide.is( LOOP ) ) {
            // 	index = between( index, 0, Controller.edgeIndex );
            // }
            this.controller.go(index, options.isNavigation);
        }
    }
    /**
     * Analyze the given event object and return important information for handling swipe behavior.
     *
     * @param event          - Touch or Mouse event object.
     * @param startInfo  - Information analyzed on start for calculating difference from the current one.
     *
     * @return - An object containing analyzed information, such as offset, velocity, etc.
     */
    analyze(event, startInfo) {
        const { timeStamp, touches } = event;
        const { clientX, clientY } = touches ? touches[0] : event;
        const { x: fromX = clientX, y: fromY = clientY } = startInfo.to || {};
        const startTime = startInfo.time || 0;
        const offset = { x: clientX - fromX, y: clientY - fromY };
        const duration = timeStamp - startTime;
        const velocity = { x: offset.x / duration, y: offset.y / duration };
        return {
            offset,
            velocity,
            to: { x: clientX, y: clientY },
            time: timeStamp,
        };
    }
}
