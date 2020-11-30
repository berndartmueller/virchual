import { ComponentDependencies } from '@virchual/components/component';
import { PREV } from '@virchual/constants';
import { each } from '@virchual/utils/dom';
import { stop } from '@virchual/utils/event';
import { Direction } from './../../types';

export type ControlsSettings = { isEnabled?: boolean };

export class Controls {
  // eslint-disable-next-line no-undef
  private _controls: NodeListOf<HTMLButtonElement>;

  constructor(private _imports: ComponentDependencies, private _settings?: ControlsSettings) {
    this._controls = this._imports.virchual.container.querySelectorAll('.virchual__control');

    this.mount();
  }

  mount(): void {
    each(this._controls, button => this._imports.eventBus.on('click', this._onClick, button));
  }

  private _onClick = (event: MouseEvent) => {
    stop(event);

    const button: HTMLButtonElement = (event.target as Element).closest('button') as HTMLButtonElement;
    const control = parseInt(button.value, 10) as Direction;

    if (control === PREV) {
      this._imports.virchual.prev();

      return;
    }

    this._imports.virchual.next();
  };
}
