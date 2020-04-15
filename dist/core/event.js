export class EventClass {
    constructor() {
        /**
         * Store all event this.data.
         */
        this.data = [];
    }
    /**
     * Subscribe the given event(s).
     *
     * @param {string}   events  - An event name. Use space to separate multiple events.
     *                             Also, namespace is accepted by dot, such as 'resize.{namespace}'.
     * @param {function} handler - A callback function.
     * @param {Element}  element     - Optional. Native event will be listened to when this arg is provided.
     * @param {Object}   options - Optional. Options for addEventListener.
     */
    on(events, handler, element, options = {}) {
        events.split(' ').forEach(event => {
            if (element) {
                element.addEventListener(event, handler, options);
            }
            this.data.push({ event, handler, elm: element, options });
        });
    }
    /**
     * Unsubscribe the given event(s).
     *
     * @param {string}  events - A event name or names split by space.
     * @param {Element} element    - Optional. removeEventListener() will be called when this arg is provided.
     */
    off(events, element) {
        events.split(' ').forEach(event => {
            this.data = this.data.filter(item => {
                if (item && item.event === event && item.elm === element) {
                    this.unsubscribe(item);
                    return false;
                }
                return true;
            });
        });
    }
    /**
     * Emit an event.
     * This method is only for custom events.
     *
     * @param {string}  event - An event name.
     * @param {*}       args  - Any number of arguments passed to handlers.
     */
    emit(event, ...args) {
        this.data.forEach(item => {
            if (!item.elm && item.event.split('.')[0] === event) {
                item.handler(...args);
            }
        });
    }
    /**
     * Clear event this.data.
     */
    destroy() {
        this.data.forEach(this.unsubscribe);
        this.data = [];
    }
    /**
     * Remove the registered event listener.
     *
     * @param item - An object containing event this.data.
     */
    unsubscribe(item) {
        if (item.elm) {
            item.elm.removeEventListener(item.event, item.handler, item.options);
        }
    }
}
export const Event = new EventClass();
