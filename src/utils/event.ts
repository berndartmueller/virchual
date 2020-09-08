export function stop(event: MouseEvent | TouchEvent) {
  if (!event) return;

  event.stopImmediatePropagation();
  event.stopPropagation();
  event.preventDefault();
}

export type EventHandler = (...args: unknown[]) => void;
export type EventTarget = (Window & typeof globalThis) | Element;
export type EventOptions = boolean | AddEventListenerOptions;

export class Event {
  /**
   * Store all event this.data.
   */
  private _handlers: Array<{
    event: string;
    handler: EventHandler;
    elm: EventTarget;
    opts: EventOptions;
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
  on(events: string, handler: EventHandler, element?: EventTarget, opts?: EventOptions): void;
  on(events: { [event: string]: EventHandler }, element?: EventTarget, opts?: EventOptions): void;
  on(
    events: string | { [event: string]: EventHandler },
    handler?: EventHandler | EventTarget,
    element?: EventTarget | EventOptions,
    opts: EventOptions = {},
  ): void {
    if (typeof events === 'string') {
      events.split(' ').forEach(event => this._addEvent(event, element as EventTarget, handler as EventHandler, opts));
    } else {
      for (const event in events) {
        this._addEvent(event, handler as EventTarget, events[event], opts);
      }
    }
  }

  /**
   * Unsubscribe the given event(s).
   *
   * @param events - A event name or names split by space.
   * @param element - Optional. removeEventListener() will be called when this arg is provided.
   */
  off(events: string, element?: EventTarget): void;
  off(events: { [event: string]: EventHandler }, element?: EventTarget): void;
  off(events: string | { [event: string]: EventHandler }, element?: EventTarget) {
    if (typeof events === 'string') {
      events.split(' ').forEach(event => this._removeEvent(event, element));
    } else {
      for (const event in events) {
        this._removeEvent(event, element);
      }
    }
  }

  /**
   * Emit an event.
   * This method is only for custom events.
   *
   * @param event - An event name.
   * @param args  - Any number of arguments passed to handlers.
   */
  emit(event: string, ...args: unknown[]) {
    this._handlers.forEach(item => {
      if (!item.elm && item.event.split('.')[0] === event) {
        item.handler(...args);
      }
    });
  }

  /**
   * Clear event this.data.
   */
  destroy() {
    this._handlers.forEach(this._unroll);
    this._handlers = [];
  }

  /**
   * Remove the registered event listener.
   *
   * @param item - An object containing event this.data.
   */
  private _unroll(item: Event['_handlers'][0]) {
    item.elm && item.elm.removeEventListener(item.event, item.handler, item.opts);
  }

  private _addEvent(event: string, element: EventTarget, handler: EventHandler, opts: EventOptions) {
    element && element.addEventListener(event, handler, opts);

    this._handlers.push({ event, handler: handler as EventHandler, elm: element as EventTarget, opts: opts });
  }

  private _removeEvent(event: string, element: EventTarget) {
    this._handlers = this._handlers.filter(item => {
      if (item && item.event === event && item.elm === element) {
        this._unroll(item);

        return false;
      }

      return true;
    });
  }
}
