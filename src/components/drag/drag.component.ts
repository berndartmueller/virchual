import ControllerComponent from '../controller/controller.component';
import { BaseLayout } from '../layout/index';
import TrackComponent from '../track/track.component';
import Virchual, { VirchualComponents, VirchualOptions } from './../../virchual';
import { BaseComponent } from './../base-component';

/**
 * Adjust how much the track can be pulled on the first or last page.
 * The larger number this is, the farther the track moves.
 * This should be around 5 - 9.
 */
const FRICTION_REDUCER = 7;

export default class DragComponent implements BaseComponent {
  // Coordinate of the track on starting drag.
  private startCoord: { x: number; y: number };

  // Analyzed info on starting drag.
  private startInfo;

  // Analyzed info being updated while dragging/swiping.
  private currentInfo;

  // Determine whether slides are being dragged or not.
  private isDragging;

  // Whether the slider direction is vertical or not.
  private isVertical = false;

  // Axis for the direction.
  private axis = this.isVertical ? 'y' : 'x';

  private isDisabled: boolean = false;

  private track: TrackComponent;
  private layout: BaseLayout;
  private controller: ControllerComponent;
  private instance: Virchual;

  constructor(private options: VirchualOptions) {}

  mount(instance: Virchual, components: VirchualComponents) {
    this.instance = instance;
    this.track = components.Track as TrackComponent;
    this.layout = components.Layout as BaseLayout;
    this.controller = components.Controller as ControllerComponent;

    this.instance.on('touchstart mousedown', this.onStart.bind(this), this.track.list);
    this.instance.on('touchmove mousemove', this.onMove.bind(this), this.track.list, { passive: false });
    this.instance.on('touchend touchcancel mouseleave mouseup dragend', this.onEnd.bind(this), this.track.list);
  }

  /**
   * Called when the track starts to be dragged.
   */
  private onStart(event: MouseEvent & TouchEvent) {
    if (!this.isDisabled && !this.isDragging) {
      this.startCoord = this.track.toCoord(this.track.position);
      this.startInfo = this.analyze(event, {});

      this.currentInfo = this.startInfo;
    }
  }

  private onMove(event: MouseEvent & TouchEvent) {
    if (this.startInfo) {
      this.currentInfo = this.analyze(event, this.startInfo);

      if (this.isDragging) {
        if (event.cancelable) {
          event.preventDefault();
        }

        const position = this.startCoord[this.axis] + this.currentInfo.offset[this.axis];

        this.track.translate(this.resist(position));
      } else {
        if (this.shouldMove(this.currentInfo)) {
          this.instance.emit('drag', this.startInfo);

          this.isDragging = true;
        }
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
   * @param position - A position being applied to the track.
   *
   * @return Adjusted position.
   */
  private resist(position: number): number {
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
  private onEnd() {
    this.startInfo = null;

    if (this.isDragging) {
      this.instance.emit('dragged', this.currentInfo);

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
      if (index === this.instance.index) {
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
  private analyze(
    event: MouseEvent & TouchEvent,
    startInfo,
  ): {
    to: { x: number; y: number };
    offset: { x: number; y: number };
    velocity: { x: number; y: number };
    time: number;
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
    };
  }
}
