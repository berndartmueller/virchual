export class Event {
  /**
   * Store all event this.data.
   */
  private data: Array<any> = [];

  /**
   * Subscribe the given event(s).
   *
   * @param events  - An event name. Use space to separate multiple events.
   *                  Also, namespace is accepted by dot, such as 'resize.{namespace}'.
   * @param handler - A callback function.
   * @param element - Optional. Native event will be listened to when this arg is provided.
   * @param options - Optional. Options for addEventListener.
   */
  on(
    events: string,
    handler: () => void,
    element?: (Window & typeof globalThis) | Element,
    options: boolean | AddEventListenerOptions = {},
  ) {
    events.split(' ').forEach(event => {
      element && element.addEventListener(event, handler, options);

      this.data.push({ event, handler, elm: element, options });
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
   * @param event - An event name.
   * @param args  - Any number of arguments passed to handlers.
   */
  emit(event: string, ...args: any[]) {
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
  private unsubscribe(item) {
    item.elm && item.elm.removeEventListener(item.event, item.handler, item.options);
  }
}
