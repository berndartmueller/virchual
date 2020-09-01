import { ComponentDependencies } from './../component';

export type LazySettings = {
  threshold?: number;
};

export class Lazy {
  constructor(private imports: ComponentDependencies, private settings?: { threshold?: number }) {
    this.settings = {
      threshold: 300,
      ...settings,
    };

    this.imports.virchual.mount();
  }
}
