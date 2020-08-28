import { Virchual } from './../virchual';
import { Event } from './../utils/event';

export type ComponentDependencies = {
  virchual: Virchual;
  eventBus: Event;
};

export interface ComponentConstructor<T, U> {
  new (imports: ComponentDependencies, settings: U): T;
}
