import { stop } from '../../utils/event';
import { ComponentDependencies } from './../component';

export type ControlsSettings = { isEnabled?: boolean };

export class Controls {
  private _controls: HTMLButtonElement[];

  constructor(private _imports: ComponentDependencies, private _settings?: ControlsSettings) {
    this._controls = [].slice.call(_imports.virchual.container.querySelectorAll('.virchual__control'));

    this.mount();
  }

  mount(): void {
    this._controls.forEach(button => this._imports.eventBus.on('click', this._onClick, button));
  }

  private _onClick = (event: MouseEvent) => {
    stop(event);

    const button: HTMLButtonElement = (event.target as Element).closest('button') as HTMLButtonElement;
    const control = button.dataset.controls as 'prev' | 'next';

    if (control === 'prev') {
      this._imports.virchual.prev();

      return;
    }

    this._imports.virchual.next();
  };
}
