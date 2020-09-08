import { identity } from './types';
import { debounce } from './utils/debouncer';
import { Event, stop } from './utils/event';

export class Drag {
  // Analyzed info on starting drag.
  private _startInfo;

  // Analyzed info being updated while dragging/swiping.
  private _currentInfo;

  // Determine whether slides are being dragged or not.
  private _isDragging = false;

  private _eventBus: Event;

  // bound event handlers (to keep `this` context)
  private _eventBindings: {
    onStart: identity;
    onMove: identity;
    onEnd: identity;
  };

  constructor(private _frame: HTMLElement, { event }: { event: Event }) {
    this._eventBus = event;

    this._eventBindings = {
      onStart: this._onStart.bind(this),
      onMove: debounce(this._onMove.bind(this), 1),
      onEnd: this._onEnd.bind(this),
    };
  }

  mount() {
    this._eventBus.on('touchstart mousedown', this._eventBindings.onStart, this._frame);
    this._eventBus.on('touchmove mousemove', this._eventBindings.onMove, this._frame, { passive: false });
    this._eventBus.on('touchend touchcancel mouseleave mouseup dragend', this._eventBindings.onEnd, this._frame);
  }

  /**
   * Called when the track starts to be dragged.
   */
  private _onStart(event: MouseEvent & TouchEvent) {
    stop(event);

    if (!this._isDragging) {
      this._startInfo = this._analyze(event, {});

      this._currentInfo = this._startInfo;

      this._eventBus.emit('dragstart', this._currentInfo);
    }
  }

  private _onMove(event: MouseEvent & TouchEvent) {
    stop(event);

    if (!this._startInfo) {
      return;
    }

    this._currentInfo = this._analyze(event, this._startInfo);

    if (this._isDragging) {
      stop(event);

      this._eventBus.emit('drag', this._currentInfo);
    } else {
      if (this._shouldMove(this._currentInfo)) {
        this._eventBus.emit('drag', this._currentInfo);

        this._isDragging = true;
      }
    }
  }

  /**
   * Determine whether to start moving the track or not by drag angle.
   *
   * @param info - An information object.
   *
   * @return True if the track should be moved or false if not.
   */
  private _shouldMove({ offset }) {
    const angle = (Math.atan(Math.abs(offset.y) / Math.abs(offset.x)) * 180) / Math.PI;

    const dragAngleThreshold = 45;

    return angle < dragAngleThreshold;
  }

  /**
   * Called when dragging ends.
   */
  private _onEnd() {
    this._startInfo = null;

    if (this._isDragging) {
      this._goTo(this._currentInfo);

      this._isDragging = false;
    }
  }

  /**
   * Go to the slide determined by the analyzed data.
   *
   * @param info - An info object.
   */
  private _goTo(info) {
    const velocity = info.velocity['x'];
    const absV = Math.abs(velocity);

    if (absV > 0) {
      this._eventBus.emit('dragend', this._currentInfo);
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
  private _analyze(
    event: MouseEvent & TouchEvent,
    startInfo,
  ): {
    to: { x: number; y: number };
    offset: { x: number; y: number };
    velocity: { x: number; y: number };
    time: number;
    control: 'prev' | 'next';
  } {
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
      control: velocity.x < 0 ? 'next' : 'prev',
    };
  }
}
