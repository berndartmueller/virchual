import { Component, ComponentDependencies } from './../component';
import { identity } from '../../types';
import { stop } from '../../utils/event';

export class Controls implements Component {
  private controls: HTMLButtonElement[];
  private onClickBound: () => identity;

  constructor(private dependencies: ComponentDependencies) {
    this.controls = [].slice.call(dependencies.virchual.container.querySelectorAll('.virchual__control'));

    dependencies.eventBus.on('destroy', () => {
      console.log('controls component destroy');
    });

    this.onClickBound = this.onClick.bind(this);
  }

  mount(): void {
    this.controls.forEach(button => this.dependencies.eventBus.on('click', this.onClickBound, button));
  }

  private onClick(event: MouseEvent) {
    stop(event);

    const button: HTMLButtonElement = (event.target as Element).closest('button') as HTMLButtonElement;
    const control = button.dataset.controls as 'prev' | 'next';

    if (control === 'prev') {
      this.dependencies.virchual.prev();

      return;
    }

    this.dependencies.virchual.next();
  }
}
