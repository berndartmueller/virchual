import { ComponentDependencies } from './../component';

export type LazySettings = {
  threshold?: number;
};

export class Lazy {
  constructor(private _imports: ComponentDependencies, private _settings?: { threshold?: number }) {
    this._settings = {
      threshold: 300,
      ..._settings,
    };

    this._imports.virchual.mount.apply(this._imports.virchual);
  }
}
