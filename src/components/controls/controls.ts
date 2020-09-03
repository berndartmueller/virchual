import { identity } from '../../types';
import { stop } from '../../utils/event';
import { ComponentDependencies } from './../component';

export type ControlsSettings = { isEnabled?: boolean };

export class Controls {
  private controls: HTMLButtonElement[];
  private onClickBound: () => identity;

  constructor(private imports: ComponentDependencies, private settings?: ControlsSettings) {
    this.controls = [].slice.call(imports.virchual.container.querySelectorAll('.virchual__control'));

    imports.eventBus.on('destroy', () => {
      console.log('controls component destroy');
    });

    this.onClickBound = this.onClick.bind(this);

    this.mount();
  }

  mount(): void {
    this.controls.forEach(button => this.imports.eventBus.on('click', this.onClickBound, button));
  }

  private onClick(event: MouseEvent) {
    stop(event);

    const button: HTMLButtonElement = (event.target as Element).closest('button') as HTMLButtonElement;
    const control = button.dataset.controls as 'prev' | 'next';

    if (control === 'prev') {
      this.imports.virchual.prev();

      return;
    }

    this.imports.virchual.next();
  }
}
