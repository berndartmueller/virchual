import { Virchual } from './../virchual';
import { Event } from './../utils/event';

export type ComponentDependencies = {
  virchual: Virchual;
  eventBus: Event;
};

export interface ComponentConstructor {
  new (dependencies: ComponentDependencies): Component;
}

export interface Component {
  mount(): void;
}
