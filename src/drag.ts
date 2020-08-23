import { debounce } from './utils/debouncer';
import { Event } from './utils/event';
import { VirchualOptions } from './virchual';

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
    onStart: () => {};
    onMove: () => {};
    onEnd: () => {};
  };

  constructor(private frame: HTMLElement, private options: VirchualOptions, { event }: { event: Event }) {
    this.event = event;

    this.eventBindings = {
      onStart: this.onStart.bind(this),
      onMove: this.onMove.bind(this),
      onEnd: this.onEnd.bind(this),
    };
  }

  start() {
    this.event.on('touchstart mousedown', this.eventBindings.onStart, this.frame);
    this.event.on('touchmove mousemove', debounce(this.eventBindings.onMove, 1), this.frame, { passive: false });
    this.event.on('touchend touchcancel mouseleave mouseup dragend', this.eventBindings.onEnd, this.frame);

    // Prevent dragging an image or anchor itself.
    [].forEach.call(this.frame.querySelectorAll('img, a'), (element: HTMLElement) => {
      this.event.on(
        'dragstart',
        e => {
          e.preventDefault();
        },
        element,
        { passive: false },
      );
    });
  }

  /**
   * Called when the track starts to be dragged.
   */
  private onStart(event: MouseEvent & TouchEvent) {
    if (!this.isDisabled && !this.isDragging) {
      // this.startCoord = this.track.toCoord(this.track.position);
      this.startInfo = this.analyze(event, {});

      this.currentInfo = this.startInfo;

      this.event.emit('dragstart', this.currentInfo);
    }
  }

  private onMove(event: MouseEvent & TouchEvent) {
    if (!this.startInfo) {
      return;
    }

    this.currentInfo = this.analyze(event, this.startInfo);

    if (this.isDragging) {
      event.cancelable && event.preventDefault();

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
    let angle = (Math.atan(Math.abs(offset.y) / Math.abs(offset.x)) * 180) / Math.PI;

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
      const options = this.options;
      const sign = velocity < 0 ? -1 : 1;

      // let destination = this.track.position;
      let destinationIndex = 0;

      if (absV > options.flickVelocityThreshold && Math.abs(info.offset['x']) < options.swipeDistanceThreshold) {
        destinationIndex += sign;
      }

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
