export function stop(event: MouseEvent | TouchEvent) {
  if (!event) return;

  event.stopImmediatePropagation();
  event.stopPropagation();
  event.preventDefault();
}

export class Event {
  /**
   * Store all event this.data.
   */
  private handlers: Array<{
    event: string;
    handler: (...args: unknown[]) => void;
    elm: (Window & typeof globalThis) | Element;
    opts: boolean | AddEventListenerOptions;
  }> = [];

  /**
   * Subscribe the given event(s).
   *
   * @param events  - An event name. Use space to separate multiple events.
   *                  Also, namespace is accepted by dot, such as 'resize.{namespace}'.
   * @param handler - A callback function.
   * @param element - Optional. Native event will be listened to when this arg is provided.
   * @param opts - Optional. Options for addEventListener.
   */
  on(
    events: string,
    handler: (...args: unknown[]) => void,
    element?: (Window & typeof globalThis) | Element,
    opts: boolean | AddEventListenerOptions = {},
  ) {
    events.split(' ').forEach(event => {
      element && element.addEventListener(event, handler, opts);

      this.handlers.push({ event, handler, elm: element, opts: opts });
    });
  }

  /**
   * Unsubscribe the given event(s).
   *
   * @param events - A event name or names split by space.
   * @param element - Optional. removeEventListener() will be called when this arg is provided.
   */
  off(events: string, element?: (Window & typeof globalThis) | Element) {
    events.split(' ').forEach(event => {
      this.handlers = this.handlers.filter(item => {
        if (item && item.event === event && item.elm === element) {
          this.unroll(item);
        }
      });
    });
  }

  /**
   * Emit an event.
   * This method is only for custom events.
   *
   * @param event - An event name.
   * @param args  - Any number of arguments passed to handlers.
   */
  emit(event: string, ...args: unknown[]) {
    this.handlers.forEach(item => {
      if (!item.elm && item.event.split('.')[0] === event) {
        item.handler(...args);
      }
    });
  }

  /**
   * Clear event this.data.
   */
  destroy() {
    this.handlers.forEach(this.unroll);
    this.handlers = [];
  }

  /**
   * Remove the registered event listener.
   *
   * @param item - An object containing event this.data.
   */
  private unroll(item) {
    item.elm && item.elm.removeEventListener(item.event, item.handler, item.opts);
  }
}
