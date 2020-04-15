export declare class EventClass {
    /**
     * Store all event this.data.
     */
    private data;
    /**
     * Subscribe the given event(s).
     *
     * @param {string}   events  - An event name. Use space to separate multiple events.
     *                             Also, namespace is accepted by dot, such as 'resize.{namespace}'.
     * @param {function} handler - A callback function.
     * @param {Element}  element     - Optional. Native event will be listened to when this arg is provided.
     * @param {Object}   options - Optional. Options for addEventListener.
     */
    on(events: string, handler: any, element?: (Window & typeof globalThis) | Element, options?: boolean | AddEventListenerOptions): void;
    /**
     * Unsubscribe the given event(s).
     *
     * @param {string}  events - A event name or names split by space.
     * @param {Element} element    - Optional. removeEventListener() will be called when this arg is provided.
     */
    off(events: string, element?: (Window & typeof globalThis) | Element): void;
    /**
     * Emit an event.
     * This method is only for custom events.
     *
     * @param {string}  event - An event name.
     * @param {*}       args  - Any number of arguments passed to handlers.
     */
    emit(event: string, ...args: any[]): void;
    /**
     * Clear event this.data.
     */
    destroy(): void;
    /**
     * Remove the registered event listener.
     *
     * @param item - An object containing event this.data.
     */
    private unsubscribe;
}
export declare const Event: EventClass;
