import Virchual, { VirchualOptions, VirchualComponents } from './../virchual';

export interface BaseComponentConstructor {
  new (options: VirchualOptions): BaseComponent;
}

export interface BaseComponent {
  mount(instance: Virchual, components: VirchualComponents): void;
}
