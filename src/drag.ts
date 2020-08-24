import { identity } from './types';
import { debounce } from './utils/debouncer';
import { Event, stop } from './utils/event';

export class Drag {
  // Coordinate of the track on starting drag.
  private startCoord: { x: number; y: number };

  // Analyzed info on starting drag.
  private startInfo;

  // Analyzed info being updated while dragging/swiping.
  private currentInfo;

  // Determine whether slides are being dragged or not.
  private isDragging = false;

  private isDisabled = false;

  private event: Event;

  // bound event handlers (to keep `this` context)
  private eventBindings: {
    onStart: identity;
    onMove: identity;
    onEnd: identity;
  };

  constructor(private frame: HTMLElement, { event }: { event: Event }) {
    this.event = event;

    this.eventBindings = {
      onStart: this.onStart.bind(this),
      onMove: debounce(this.onMove.bind(this), 1),
      onEnd: this.onEnd.bind(this),
    };
  }

  start() {
    this.event.on('touchstart mousedown', this.eventBindings.onStart, this.frame);
    this.event.on('touchmove mousemove', this.eventBindings.onMove, this.frame, { passive: false });
    this.event.on('touchend touchcancel mouseleave mouseup dragend', this.eventBindings.onEnd, this.frame);
  }

  /**
   * Called when the track starts to be dragged.
   */
  private onStart(event: MouseEvent & TouchEvent) {
    stop(event);

    if (!this.isDisabled && !this.isDragging) {
      this.startInfo = this.analyze(event, {});

      this.currentInfo = this.startInfo;

      this.event.emit('dragstart', this.currentInfo);
    }
  }

  private onMove(event: MouseEvent & TouchEvent) {
    stop(event);

    if (!this.startInfo) {
      return;
    }

    this.currentInfo = this.analyze(event, this.startInfo);

    if (this.isDragging) {
      stop(event);

      this.event.emit('drag', this.currentInfo);
    } else {
      if (this.shouldMove(this.currentInfo)) {
        this.event.emit('drag', this.currentInfo);

        this.isDragging = true;
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
  private shouldMove({ offset }) {
    const angle = (Math.atan(Math.abs(offset.y) / Math.abs(offset.x)) * 180) / Math.PI;

    const dragAngleThreshold = 45;

    return angle < dragAngleThreshold;
  }

  /**
   * Called when dragging ends.
   */
  private onEnd() {
    this.startInfo = null;

    if (this.isDragging) {
      this.go(this.currentInfo);

      this.isDragging = false;
    }
  }

  /**
   * Go to the slide determined by the analyzed data.
   *
   * @param info - An info object.
   */
  private go(info) {
    const velocity = info.velocity['x'];
    const absV = Math.abs(velocity);

    if (absV > 0) {
      this.event.emit('dragend', this.currentInfo);
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
  private analyze(
    event: MouseEvent & TouchEvent,
    startInfo,
  ): {
    to: { x: number; y: number };
    offset: { x: number; y: number };
    velocity: { x: number; y: number };
    time: number;
    direction: 'prev' | 'next';
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
      direction: velocity.x < 0 ? 'next' : 'prev',
    };
  }
}
